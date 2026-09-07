const db = require("../config/db");


// Create purchase
const createPurchase = async (purchase, connection = db) => {

    const {
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
            supplier_id,
            invoice_number,
            total_amount,
            remarks,
            created_by
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            supplier_id,
            invoice_number || null,
            total_amount,
            remarks || null,
            created_by
        ]
    );


    return result.insertId;

};


// Create purchase items
const createPurchaseItems = async (
    purchase_id,
    items,
    connection = db
) => {


    for (const item of items) {

        const subtotal =
            item.quantity * item.buying_price;


        await connection.query(
            `
            INSERT INTO purchase_items
            (
                purchase_id,
                product_id,
                quantity,
                buying_price,
                subtotal
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
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
const getAllPurchases = async () => {

    const [rows] = await db.query(
        `
        SELECT
            p.*,
            s.name AS supplier_name
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
        ORDER BY p.id DESC
        `
    );


    return rows;

};


// Get purchase by ID
const getPurchaseById = async (id) => {


    const [purchase] = await db.query(
        `
        SELECT
            p.*,
            s.name AS supplier_name
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
        WHERE p.id = ?
        `,
        [id]
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
        WHERE pi.purchase_id = ?
        `,
        [id]
    );


    return {
        ...purchase[0],
        items
    };

};


// Search purchases
const searchPurchases = async (keyword) => {


    const [rows] = await db.query(
        `
        SELECT
            p.*,
            s.name AS supplier_name
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
        WHERE
            p.invoice_number LIKE ?
            OR s.name LIKE ?
        ORDER BY p.id DESC
        `,
        [
            `%${keyword}%`,
            `%${keyword}%`
        ]
    );


    return rows;

};


// Pagination
const getPurchasesPaginated = async (
    page = 1,
    limit = 10
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
        ORDER BY p.id DESC
        LIMIT ?
        OFFSET ?
        `,
        [
            Number(limit),
            Number(offset)
        ]
    );


    const [[count]] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM purchases
        `
    );


    return {
        purchases: rows,
        total: count.total
    };

};


// Purchase statistics
const getPurchaseStatistics = async () => {


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
            WHEN status='Completed'
            THEN 1
            END
        ) AS completedPurchases,

        COUNT(
            CASE 
            WHEN status='Cancelled'
            THEN 1
            END
        ) AS cancelledPurchases

        FROM purchases
        `
    );


    return stats;

};


// Count purchases by supplier
const countPurchasesBySupplier = async (supplier_id, storeId) => {

    const [[result]] = await db.query(
        `
        SELECT COUNT(*) AS count
        FROM purchases
        WHERE supplier_id = ?
        AND store_id = ?
        `,
        [supplier_id, storeId]
    );

    return result.count;

};

const getPurchaseByInvoiceNumber = async (invoice_number) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM purchases
        WHERE invoice_number = ?
        LIMIT 1
        `,
        [invoice_number]
    );

    return rows[0];

};


module.exports = {

    createPurchase,
    createPurchaseItems,

    getAllPurchases,
    getPurchaseById,

    searchPurchases,
    getPurchasesPaginated,

    getPurchaseStatistics,

    countPurchasesBySupplier,

    getPurchaseByInvoiceNumber

};