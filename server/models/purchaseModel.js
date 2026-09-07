const db = require("../config/db");

// Create purchase
const createPurchase = async (purchase, connection = db) => {
    const {
        store_id,
        supplier_id,
        invoice_number,
        total_amount,
        remarks,
        created_by
    } = purchase;

    const [result] = await connection.query(
        `
        INSERT INTO purchases
        (
            store_id,
            supplier_id,
            invoice_number,
            total_amount,
            remarks,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            store_id,
            supplier_id,
            invoice_number || null,
            total_amount,
            remarks || null,
            created_by
        ]
    );

    return result.insertId;
};


// Find purchase by invoice number within a store
const getPurchaseByInvoiceNumber = async (
    invoiceNumber,
    storeId,
    connection = db
) => {
    if (!invoiceNumber) {
        return null;
    }

    const [rows] = await connection.query(
        `
        SELECT *
        FROM purchases
        WHERE invoice_number = ?
        AND store_id = ?
        LIMIT 1
        `,
        [
            invoiceNumber,
            storeId
        ]
    );

    return rows[0];
};


// Create purchase items
const createPurchaseItems = async (
    purchase_id,
    items,
    storeId,
    connection = db
) => {

    for (const item of items) {

        const subtotal =
            item.quantity * item.buying_price;

        await connection.query(
            `
            INSERT INTO purchase_items
            (
                store_id,
                purchase_id,
                product_id,
                quantity,
                buying_price,
                subtotal
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                storeId,
                purchase_id,
                item.product_id,
                item.quantity,
                item.buying_price,
                subtotal
            ]
        );
    }
};


// Get all purchases
const getAllPurchases = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            p.*,
            s.name AS supplier_name
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
            AND s.store_id = p.store_id
        WHERE p.store_id = ?
        ORDER BY p.id DESC
        `,
        [storeId]
    );

    return rows;
};


// Get purchase by ID
const getPurchaseById = async (id, storeId) => {

    const [purchase] = await db.query(
        `
        SELECT
            p.*,
            s.name AS supplier_name
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
            AND s.store_id = p.store_id
        WHERE p.id = ?
        AND p.store_id = ?
        LIMIT 1
        `,
        [
            id,
            storeId
        ]
    );

    if (!purchase[0]) {
        return null;
    }

    const [items] = await db.query(
        `
        SELECT
            pi.*,
            pr.name AS product_name
        FROM purchase_items pi
        LEFT JOIN products pr
            ON pi.product_id = pr.id
            AND pr.store_id = pi.store_id
        WHERE pi.purchase_id = ?
        AND pi.store_id = ?
        `,
        [
            id,
            storeId
        ]
    );

    return {
        ...purchase[0],
        items
    };
};


// Search purchases
const searchPurchases = async (
    keyword,
    storeId
) => {

    const search = `%${keyword}%`;

    const [rows] = await db.query(
        `
        SELECT
            p.*,
            s.name AS supplier_name
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
            AND s.store_id = p.store_id
        WHERE p.store_id = ?
        AND (
            p.invoice_number LIKE ?
            OR s.name LIKE ?
        )
        ORDER BY p.id DESC
        `,
        [
            storeId,
            search,
            search
        ]
    );

    return rows;
};


// Pagination
const getPurchasesPaginated = async (
    page = 1,
    limit = 10,
    storeId
) => {

    const offset =
        (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT
            p.*,
            s.name AS supplier_name
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
            AND s.store_id = p.store_id
        WHERE p.store_id = ?
        ORDER BY p.id DESC
        LIMIT ?
        OFFSET ?
        `,
        [
            storeId,
            Number(limit),
            Number(offset)
        ]
    );

    const [[count]] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM purchases
        WHERE store_id = ?
        `,
        [storeId]
    );

    return {
        purchases: rows,
        total: count.total
    };
};


// Purchase statistics
const getPurchaseStatistics = async (storeId) => {

    const [[stats]] = await db.query(
        `
        SELECT

        COUNT(*) AS totalPurchases,

        COALESCE(
            SUM(total_amount),
            0
        ) AS totalAmount,

        COUNT(
            CASE
            WHEN status = 'Completed'
            THEN 1
            END
        ) AS completedPurchases,

        COUNT(
            CASE
            WHEN status = 'Cancelled'
            THEN 1
            END
        ) AS cancelledPurchases

        FROM purchases
        WHERE store_id = ?
        `,
        [storeId]
    );

    return stats;
};


module.exports = {
    createPurchase,
    getPurchaseByInvoiceNumber,
    createPurchaseItems,
    getAllPurchases,
    getPurchaseById,
    searchPurchases,
    getPurchasesPaginated,
    getPurchaseStatistics
};