const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

const getSalesReport = async (startDate, endDate, storeId) => {
    const [rows] = await db.query(
        `
        SELECT
            s.id,
            s.store_id,
            c.name AS customer_name,
            s.payment_method,
            s.subtotal,
            s.discount,
            s.total,
            s.created_at
        FROM sales s
        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id
        WHERE s.store_id = ?
        AND DATE(s.created_at) BETWEEN ? AND ?
        ORDER BY s.created_at DESC
        `,
        [storeId, startDate, endDate]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Purchase Report
|--------------------------------------------------------------------------
*/

const getPurchaseReport = async (startDate, endDate, storeId) => {
    const [rows] = await db.query(
        `
        SELECT
            p.id,
            p.store_id,
            s.name AS supplier_name,
            p.invoice_number,
            p.total_amount,
            p.status,
            p.created_at
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
            AND s.store_id = p.store_id
        WHERE p.store_id = ?
        AND DATE(p.created_at) BETWEEN ? AND ?
        ORDER BY p.created_at DESC
        `,
        [storeId, startDate, endDate]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Expense Report
|--------------------------------------------------------------------------
*/

const getExpenseReport = async (startDate, endDate, storeId) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            store_id,
            expense_name,
            amount,
            description,
            expense_date
        FROM expenses
        WHERE store_id = ?
        AND expense_date BETWEEN ? AND ?
        ORDER BY expense_date DESC
        `,
        [storeId, startDate, endDate]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Inventory Report
|--------------------------------------------------------------------------
*/

const getInventoryReport = async (storeId) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            store_id,
            barcode,
            name,
            quantity,
            buying_price,
            selling_price,
            minimum_stock,
            status
        FROM products
        WHERE store_id = ?
        ORDER BY name ASC
        `,
        [storeId]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Profit Summary
|--------------------------------------------------------------------------
*/

const getProfitReport = async (startDate, endDate, storeId) => {

    const [[sales]] = await db.query(
        `
        SELECT
            IFNULL(SUM(total), 0) AS revenue
        FROM sales
        WHERE store_id = ?
        AND DATE(created_at) BETWEEN ? AND ?
        `,
        [storeId, startDate, endDate]
    );


    const [[purchases]] = await db.query(
        `
        SELECT
            IFNULL(SUM(total_amount), 0) AS purchases
        FROM purchases
        WHERE store_id = ?
        AND DATE(created_at) BETWEEN ? AND ?
        `,
        [storeId, startDate, endDate]
    );


    const [[expenses]] = await db.query(
        `
        SELECT
            IFNULL(SUM(amount), 0) AS expenses
        FROM expenses
        WHERE store_id = ?
        AND expense_date BETWEEN ? AND ?
        `,
        [storeId, startDate, endDate]
    );


    return {
        revenue: Number(sales.revenue),
        purchases: Number(purchases.purchases),
        expenses: Number(expenses.expenses),

        profit:
            Number(sales.revenue) -
            Number(purchases.purchases) -
            Number(expenses.expenses)
    };
};


module.exports = {
    getSalesReport,
    getPurchaseReport,
    getExpenseReport,
    getInventoryReport,
    getProfitReport
};