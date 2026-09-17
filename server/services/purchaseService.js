const db = require("../config/db");
const Purchase = require("../models/purchaseModel");

// ============================================================
// Create purchase
// ============================================================

const createPurchase = async (
    data,
    userId,
    storeId
) => {

    const connection =
        await db.getConnection();

    try {

        await connection.beginTransaction();

        const {
            supplier_id,
            invoice_number,
            remarks,
            items
        } = data;

        // Validate supplier
        if (!supplier_id) {
            throw new Error(
                "Supplier is required."
            );
        }

        const [supplier] =
            await connection.query(
                `
                SELECT id
                FROM suppliers
                WHERE id = ?
                AND store_id = ?
                AND status = 'active'
                LIMIT 1
                `,
                [
                    supplier_id,
                    storeId
                ]
            );

        if (!supplier[0]) {
            throw new Error(
                "Supplier not found in this store."
            );
        }

        // Validate items
        if (
            !items ||
            items.length === 0
        ) {
            throw new Error(
                "Purchase items are required."
            );
        }

        let totalAmount = 0;

        // Validate every product
        for (const item of items) {

            if (!item.product_id) {
                throw new Error(
                    "Product ID is required."
                );
            }

            if (
                !item.quantity ||
                item.quantity <= 0
            ) {
                throw new Error(
                    "Invalid quantity."
                );
            }

            if (
                item.buying_price === undefined ||
                item.buying_price === null ||
                item.buying_price < 0
            ) {
                throw new Error(
                    "Invalid buying price."
                );
            }

            const [product] =
                await connection.query(
                    `
                    SELECT
                        id,
                        quantity
                    FROM products
                    WHERE id = ?
                    AND store_id = ?
                    AND status = 'active'
                    LIMIT 1
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );

            if (!product[0]) {
                throw new Error(
                    `Product ${item.product_id} not found in this store.`
                );
            }

            totalAmount +=
                Number(item.quantity) *
                Number(item.buying_price);
        }

        // Check duplicate invoice
        const existingInvoice =
            await Purchase.getPurchaseByInvoiceNumber(
                invoice_number,
                storeId,
                connection
            );

        if (existingInvoice) {
            throw new Error(
                "Invoice number already exists."
            );
        }

        // Create purchase
        const purchaseId =
            await Purchase.createPurchase(
                {
                    store_id: storeId,
                    supplier_id,
                    invoice_number,
                    total_amount: totalAmount,
                    remarks,
                    created_by: userId
                },
                connection
            );

        // Create purchase items
        await Purchase.createPurchaseItems(
            purchaseId,
            items,
            storeId,
            connection
        );

        // Update stock
        for (const item of items) {

            const [productRows] =
                await connection.query(
                    `
                    SELECT quantity
                    FROM products
                    WHERE id = ?
                    AND store_id = ?
                    AND status = 'active'
                    FOR UPDATE
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );

            if (!productRows[0]) {
                throw new Error(
                    "Product not found."
                );
            }

            const currentBalance =
                Number(productRows[0].quantity);

            const quantityReceived =
                Number(item.quantity);

            const newBalance =
                currentBalance +
                quantityReceived;

            await connection.query(
                `
                UPDATE products
                SET quantity = ?
                WHERE id = ?
                AND store_id = ?
                `,
                [
                    newBalance,
                    item.product_id,
                    storeId
                ]
            );

            // Create stock movement
            await connection.query(
                `
                INSERT INTO stock_movements
                (
                    store_id,
                    product_id,
                    reference_id,
                    reference_type,
                    movement_type,
                    quantity,
                    balance_after,
                    remarks
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    storeId,
                    item.product_id,
                    purchaseId,
                    "Purchase",
                    "Stock In",
                    quantityReceived,
                    newBalance,
                    "Stock received from purchase"
                ]
            );
        }

        await connection.commit();

        return {
            purchaseId,
            totalAmount
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};


// ============================================================
// Cancel purchase
// ============================================================

const cancelPurchase = async (
    purchaseId,
    userId,
    storeId
) => {

    const connection =
        await db.getConnection();

    try {

        await connection.beginTransaction();

        // Lock purchase
        const [purchaseRows] =
            await connection.query(
                `
                SELECT
                    id,
                    store_id,
                    status,
                    invoice_number
                FROM purchases
                WHERE id = ?
                AND store_id = ?
                FOR UPDATE
                `,
                [
                    purchaseId,
                    storeId
                ]
            );

        if (!purchaseRows[0]) {
            throw new Error(
                "Purchase not found."
            );
        }

        const purchase =
            purchaseRows[0];

        // Prevent duplicate cancellation
        if (
            purchase.status === "Cancelled"
        ) {
            throw new Error(
                "Purchase is already cancelled."
            );
        }

        // Only completed purchases
        if (
            purchase.status !== "Completed"
        ) {
            throw new Error(
                "Only completed purchases can be cancelled."
            );
        }

        // Get purchase items
        const [items] =
            await connection.query(
                `
                SELECT
                    product_id,
                    SUM(quantity) AS quantity
                FROM purchase_items
                WHERE purchase_id = ?
                AND store_id = ?
                GROUP BY product_id
                `,
                [
                    purchaseId,
                    storeId
                ]
            );

        if (items.length === 0) {
            throw new Error(
                "Purchase has no items to reverse."
            );
        }

        // Reverse stock
        for (const item of items) {

            const quantityToReverse =
                Number(item.quantity);

            if (
                !Number.isInteger(quantityToReverse) ||
                quantityToReverse <= 0
            ) {
                throw new Error(
                    "Invalid purchase quantity."
                );
            }

            // Lock product
            const [productRows] =
                await connection.query(
                    `
                    SELECT
                        id,
                        name,
                        quantity
                    FROM products
                    WHERE id = ?
                    AND store_id = ?
                    AND status = 'active'
                    FOR UPDATE
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );

            if (!productRows[0]) {
                throw new Error(
                    `Product ${item.product_id} not found in this store.`
                );
            }

            const product =
                productRows[0];

            const currentStock =
                Number(product.quantity);

            // Prevent negative stock
            if (
                currentStock <
                quantityToReverse
            ) {
                throw new Error(
                    `Cannot cancel purchase because ${product.name} has insufficient stock.`
                );
            }

            const newBalance =
                currentStock -
                quantityToReverse;

            // Update stock
            await connection.query(
                `
                UPDATE products
                SET quantity = ?
                WHERE id = ?
                AND store_id = ?
                `,
                [
                    newBalance,
                    item.product_id,
                    storeId
                ]
            );

            // Record reversal
            await connection.query(
                `
                INSERT INTO stock_movements
                (
                    store_id,
                    product_id,
                    reference_id,
                    reference_type,
                    movement_type,
                    quantity,
                    balance_after,
                    remarks
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    storeId,
                    item.product_id,
                    purchaseId,
                    "Purchase Cancellation",
                    "Adjustment",
                    quantityToReverse,
                    newBalance,
                    "Purchase cancellation stock reversal"
                ]
            );
        }

        // Mark purchase cancelled
        const [updateResult] =
            await connection.query(
                `
                UPDATE purchases
                SET status = 'Cancelled'
                WHERE id = ?
                AND store_id = ?
                AND status = 'Completed'
                `,
                [
                    purchaseId,
                    storeId
                ]
            );

        if (
            updateResult.affectedRows !== 1
        ) {
            throw new Error(
                "Purchase cancellation could not be completed."
            );
        }

        await connection.commit();

        return {
            purchaseId: Number(purchaseId),
            invoiceNumber:
                purchase.invoice_number,
            status: "Cancelled"
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};


// ============================================================
// Get all purchases
// ============================================================

const getPurchases = async (
    storeId
) => {

    return await Purchase.getAllPurchases(
        storeId
    );

};


// ============================================================
// Get purchase
// ============================================================

const getPurchase = async (
    id,
    storeId
) => {

    const purchase =
        await Purchase.getPurchaseById(
            id,
            storeId
        );

    if (!purchase) {
        throw new Error(
            "Purchase not found."
        );
    }

    return purchase;
};


// ============================================================
// Search purchases
// ============================================================

const searchPurchases = async (
    keyword,
    storeId
) => {

    return await Purchase.searchPurchases(
        keyword,
        storeId
    );

};


// ============================================================
// Pagination
// ============================================================

const getPurchasesPaginated =
async (
    page,
    limit,
    storeId
) => {

    return await Purchase.getPurchasesPaginated(
        page,
        limit,
        storeId
    );

};


// ============================================================
// Statistics
// ============================================================

const getPurchaseStatistics =
async (
    storeId
) => {

    return await Purchase.getPurchaseStatistics(
        storeId
    );

};


// ============================================================
// Exports
// ============================================================

module.exports = {

    createPurchase,

    cancelPurchase,

    getPurchases,

    getPurchase,

    searchPurchases,

    getPurchasesPaginated,

    getPurchaseStatistics

};
