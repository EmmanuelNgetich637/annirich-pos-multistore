const db = require("../config/db");

const Sale = require("../models/saleModel");


// ============================================================
// CREATE SALE
// ============================================================

const createSale = async (
    data,
    userId,
    storeId
) => {

    const connection =
        await db.getConnection();

    try {

        await connection.beginTransaction();


        // Validate sale items
        if (
            !data.items ||
            !Array.isArray(data.items) ||
            data.items.length === 0
        ) {

            throw new Error(
                "Sale items are required."
            );

        }


        // Validate payment method
        if (!data.payment_method) {

            throw new Error(
                "Payment method is required."
            );

        }


        let subtotal = 0;


        // Validate customer if supplied
        if (data.customer_id) {

            const [customers] =
                await connection.query(
                    `
                    SELECT id
                    FROM customers
                    WHERE id = ?
                    AND store_id = ?
                    LIMIT 1
                    `,
                    [
                        data.customer_id,
                        storeId
                    ]
                );


            if (!customers[0]) {

                throw new Error(
                    "Customer not found in this store."
                );

            }

        }


        // Validate every product
        for (const item of data.items) {

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
                item.selling_price === undefined ||
                item.selling_price === null ||
                item.selling_price < 0
            ) {

                throw new Error(
                    "Invalid selling price."
                );

            }


            const [products] =
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
                    LIMIT 1
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );


            if (!products[0]) {

                throw new Error(
                    `Product ${item.product_id} not found in this store.`
                );

            }


            const product =
                products[0];


            if (
                product.quantity <
                item.quantity
            ) {

                throw new Error(
                    `Insufficient stock for ${product.name}.`
                );

            }


            subtotal +=
                Number(item.quantity) *
                Number(item.selling_price);

        }


        // Calculate discount
        const discount =
            Number(data.discount || 0);


        if (discount < 0) {

            throw new Error(
                "Invalid discount."
            );

        }


        if (discount > subtotal) {

            throw new Error(
                "Discount cannot exceed subtotal."
            );

        }


        // Calculate total
        const total =
            subtotal - discount;


        // Determine payment status
        //
        // M-Pesa starts as pending because
        // Safaricom must confirm the payment.
        //
        // Cash and Card are currently
        // treated as paid.
        const paymentStatus =
            data.payment_method === "Mpesa"
                ? "pending"
                : "paid";


        // Create sale
        const [saleResult] =
            await connection.query(
                `
                INSERT INTO sales
                (
                    store_id,
                    customer_id,
                    cashier_id,
                    payment_method,
                    payment_status,
                    subtotal,
                    discount,
                    total
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    storeId,
                    data.customer_id || null,
                    userId,
                    data.payment_method,
                    paymentStatus,
                    subtotal,
                    discount,
                    total
                ]
            );


        const saleId =
            saleResult.insertId;


        // Process sale items
        for (const item of data.items) {


            // Insert sale item
            await connection.query(
                `
                INSERT INTO sale_items
                (
                    store_id,
                    sale_id,
                    product_id,
                    quantity,
                    selling_price
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    storeId,
                    saleId,
                    item.product_id,
                    item.quantity,
                    item.selling_price
                ]
            );


            // Lock product row before
            // changing stock
            const [products] =
                await connection.query(
                    `
                    SELECT quantity
                    FROM products
                    WHERE id = ?
                    AND store_id = ?
                    FOR UPDATE
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );


            if (!products[0]) {

                throw new Error(
                    "Product not found."
                );

            }


            // Calculate new stock balance
            const newBalance =
                Number(products[0].quantity) -
                Number(item.quantity);


            if (newBalance < 0) {

                throw new Error(
                    "Insufficient stock."
                );

            }


            // Reduce stock
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


            // Record stock movement
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
                    saleId,
                    "Sale",
                    "Sale",
                    item.quantity,
                    newBalance,
                    "Sale Stock Out"
                ]
            );

        }


        // Commit transaction
        await connection.commit();


        // Return created sale
        return {

            saleId,

            subtotal,

            discount,

            total,

            paymentStatus

        };


    } catch (error) {

        // Rollback if anything fails
        await connection.rollback();

        throw error;


    } finally {

        // Release database connection
        connection.release();

    }

};


// ============================================================
// GET ALL SALES
// ============================================================

const getSales = async (
    storeId
) => {

    return await Sale.getAllSales(
        storeId
    );

};


// ============================================================
// GET SALE
// ============================================================

const getSale = async (
    id,
    storeId
) => {

    const sale =
        await Sale.getSaleById(
            id,
            storeId
        );


    if (!sale) {

        throw new Error(
            "Sale not found."
        );

    }


    return sale;

};


// ============================================================
// SEARCH SALES
// ============================================================

const searchSales = async (
    keyword,
    storeId
) => {

    return await Sale.searchSales(
        keyword,
        storeId
    );

};


// ============================================================
// PAGINATION
// ============================================================

const getSalesPaginated = async (
    page,
    limit,
    storeId
) => {

    return await Sale.getSalesPaginated(
        page,
        limit,
        storeId
    );

};


// ============================================================
// STATISTICS
// ============================================================

const getSaleStatistics = async (
    storeId
) => {

    return await Sale.getSaleStatistics(
        storeId
    );

};


// ============================================================
// FAIL / ROLLBACK PENDING M-PESA SALE
// ============================================================

const failMpesaSale = async (
    saleId,
    storeId,
    reason = "M-Pesa payment failed"
) => {

    const connection =
        await db.getConnection();

    try {

        await connection.beginTransaction();


        /*
         * Lock the sale so two callbacks cannot
         * process the same failed payment at once.
         */
        const [sales] =
            await connection.query(
                `
                SELECT
                    id,
                    payment_method,
                    payment_status
                FROM sales
                WHERE id = ?
                AND store_id = ?
                FOR UPDATE
                `,
                [
                    saleId,
                    storeId
                ]
            );


        if (!sales[0]) {

            throw new Error(
                "Sale not found."
            );

        }


        const sale =
            sales[0];


        /*
         * Only M-Pesa sales can use
         * this rollback operation.
         */
        if (
            sale.payment_method !==
            "Mpesa"
        ) {

            throw new Error(
                "Only M-Pesa sales can be rolled back."
            );

        }


        /*
         * If already failed, stock has
         * already been restored.
         *
         * Do nothing.
         *
         * This makes the operation idempotent.
         */
        if (
            sale.payment_status ===
            "failed"
        ) {

            await connection.commit();

            return {

                restored: false,

                alreadyFailed: true

            };

        }


        /*
         * Never reverse a sale that has
         * already been successfully paid.
         */
        if (
            sale.payment_status ===
            "paid"
        ) {

            await connection.commit();

            return {

                restored: false,

                alreadyPaid: true

            };

        }


        /*
         * Only pending sales can reach
         * the stock restoration logic.
         */
        if (
            sale.payment_status !==
            "pending"
        ) {

            throw new Error(
                `Cannot roll back sale with payment status: ${sale.payment_status}`
            );

        }


        /*
         * Get all products belonging
         * to this sale.
         */
        const [items] =
            await connection.query(
                `
                SELECT
                    product_id,
                    quantity
                FROM sale_items
                WHERE sale_id = ?
                AND store_id = ?
                `,
                [
                    saleId,
                    storeId
                ]
            );


        /*
         * Make sure the sale actually
         * contains products.
         */
        if (items.length === 0) {

            throw new Error(
                "Cannot roll back sale with no sale items."
            );

        }


        /*
         * Restore every product's stock.
         */
        for (const item of items) {


            /*
             * Lock product row so concurrent
             * stock operations cannot interfere.
             */
            const [products] =
                await connection.query(
                    `
                    SELECT
                        quantity
                    FROM products
                    WHERE id = ?
                    AND store_id = ?
                    FOR UPDATE
                    `,
                    [
                        item.product_id,
                        storeId
                    ]
                );


            if (!products[0]) {

                throw new Error(
                    `Product ${item.product_id} not found while restoring stock.`
                );

            }


            const currentBalance =
                Number(
                    products[0].quantity
                );


            const restoredQuantity =
                Number(
                    item.quantity
                );


            const newBalance =
                currentBalance +
                restoredQuantity;


            /*
             * Restore stock.
             */
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


            /*
             * Record the reversal.
             *
             * movement_type MUST be one of:
             *
             * Stock In
             * Sale
             * Adjustment
             *
             * Therefore we use Adjustment.
             *
             * The remarks identify the movement
             * as an M-Pesa sale reversal.
             */
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
                    saleId,
                    "Sale",
                    "Adjustment",
                    restoredQuantity,
                    newBalance,
                    `M-Pesa Sale Reversal - ${reason}`
                ]
            );

        }


        /*
         * Finally mark the sale as failed.
         *
         * The WHERE payment_status = 'pending'
         * protects against another process changing
         * the sale at the same time.
         */
        const [updateResult] =
            await connection.query(
                `
                UPDATE sales
                SET payment_status = 'failed'
                WHERE id = ?
                AND store_id = ?
                AND payment_status = 'pending'
                `,
                [
                    saleId,
                    storeId
                ]
            );


        /*
         * Safety check.
         */
        if (
            updateResult.affectedRows !== 1
        ) {

            throw new Error(
                "Sale status could not be changed to failed."
            );

        }


        /*
         * Commit:
         *
         * 1. Stock restoration
         * 2. Stock movement
         * 3. Sale failure
         *
         * all happen atomically.
         */
        await connection.commit();


        return {

            restored: true,

            alreadyFailed: false,

            saleId,

            storeId

        };


    } catch (error) {

        /*
         * If ANY operation fails,
         * rollback the entire transaction.
         */
        await connection.rollback();

        throw error;


    } finally {

        connection.release();

    }

};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    createSale,

    failMpesaSale,

    getSales,

    getSale,

    searchSales,

    getSalesPaginated,

    getSaleStatistics,

};