const db = require("../config/db");


// GET ALL SALES
const getAllSales = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            s.*,
            c.name AS customer_name,
            u.full_name AS cashier_name
        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id

        LEFT JOIN users u
            ON s.cashier_id = u.id
            AND u.store_id = s.store_id

        WHERE s.store_id = ?

        ORDER BY s.id DESC
        `,
        [storeId]
    );

    return rows;
};


// GET SALE BY ID
const getSaleById = async (id, storeId) => {

    const [sales] = await db.query(
        `
        SELECT
            s.*,
            c.name AS customer_name,
            u.full_name AS cashier_name
        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id

        LEFT JOIN users u
            ON s.cashier_id = u.id
            AND u.store_id = s.store_id

        WHERE s.id = ?
        AND s.store_id = ?

        LIMIT 1
        `,
        [id, storeId]
    );

    if (!sales[0]) {
        return null;
    }

    const [items] = await db.query(
        `
        SELECT
            si.*,
            p.name AS product_name
        FROM sale_items si

        LEFT JOIN products p
            ON si.product_id = p.id
            AND p.store_id = si.store_id

        WHERE si.sale_id = ?
        AND si.store_id = ?

        ORDER BY si.id ASC
        `,
        [id, storeId]
    );

    return {
        ...sales[0],
        items
    };

};


// SEARCH SALES
const searchSales = async (keyword, storeId) => {

    const search = `%${keyword}%`;

    const [rows] = await db.query(
        `
        SELECT
            s.*,
            c.name AS customer_name,
            u.full_name AS cashier_name
        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id

        LEFT JOIN users u
            ON s.cashier_id = u.id
            AND u.store_id = s.store_id

        WHERE s.store_id = ?

        AND (
            CAST(s.id AS CHAR) LIKE ?
            OR c.name LIKE ?
            OR u.full_name LIKE ?
            OR s.payment_method LIKE ?
            OR CAST(s.subtotal AS CHAR) LIKE ?
            OR CAST(s.discount AS CHAR) LIKE ?
            OR CAST(s.total AS CHAR) LIKE ?
        )

        ORDER BY s.id DESC
        `,
        [
            storeId,
            search,
            search,
            search,
            search,
            search,
            search,
            search
        ]
    );

    return rows;

};


// PAGINATION
const getSalesPaginated = async (
    page = 1,
    limit = 10,
    storeId
) => {

    const offset =
        (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT
            s.*,
            c.name AS customer_name,
            u.full_name AS cashier_name
        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id

        LEFT JOIN users u
            ON s.cashier_id = u.id
            AND u.store_id = s.store_id

        WHERE s.store_id = ?

        ORDER BY s.id DESC

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
        FROM sales
        WHERE store_id = ?
        `,
        [storeId]
    );

    return {
        sales: rows,
        total: count.total
    };

};


// STATISTICS
const getSaleStatistics = async (storeId) => {

    const [[stats]] = await db.query(
        `
        SELECT

            COUNT(*) AS totalSales,

            COALESCE(
                SUM(subtotal),
                0
            ) AS totalSubtotal,

            COALESCE(
                SUM(discount),
                0
            ) AS totalDiscount,

            COALESCE(
                SUM(total),
                0
            ) AS totalAmount

        FROM sales

        WHERE store_id = ?
        `,
        [storeId]
    );

    return stats;

};


module.exports = {

    getAllSales,

    getSaleById,

    searchSales,

    getSalesPaginated,

    getSaleStatistics

};