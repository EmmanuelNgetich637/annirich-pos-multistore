const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const normalizeDates = (startDate, endDate) => {
    const start = startDate || "2000-01-01";
    const end = endDate || "2999-12-31";

    return { start, end };
};


/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

const getSalesReport = async (startDate, endDate, storeId) => {

    const { start, end } = normalizeDates(startDate, endDate);

    const [rows] = await db.query(
        `
        SELECT
            s.id,
            s.store_id,
            c.name AS customer_name,
            u.full_name AS cashier_name,
            s.payment_method,
            s.payment_status,
            s.subtotal,
            s.discount,
            s.total,
            s.created_at
        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id

        LEFT JOIN users u
            ON s.cashier_id = u.id
            AND u.store_id = s.store_id

        WHERE s.store_id = ?
        AND s.payment_status = 'paid'
        AND DATE(s.created_at) BETWEEN ? AND ?

        ORDER BY s.created_at DESC
        `,
        [storeId, start, end]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Purchase Report
|--------------------------------------------------------------------------
*/

const getPurchaseReport = async (startDate, endDate, storeId) => {

    const { start, end } = normalizeDates(startDate, endDate);

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
        AND p.status = 'Completed'
        AND DATE(p.created_at) BETWEEN ? AND ?

        ORDER BY p.created_at DESC
        `,
        [storeId, start, end]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Expense Report
|--------------------------------------------------------------------------
*/

const getExpenseReport = async (startDate, endDate, storeId) => {

    const { start, end } = normalizeDates(startDate, endDate);

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
        AND DATE(expense_date) BETWEEN ? AND ?

        ORDER BY expense_date DESC
        `,
        [storeId, start, end]
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
            p.id,
            p.store_id,
            p.barcode,
            p.name,
            c.name AS category_name,
            p.quantity,
            p.buying_price,
            p.selling_price,
            p.minimum_stock,
            p.status
        FROM products p

        LEFT JOIN categories c
            ON p.category_id = c.id
            AND c.store_id = p.store_id

        WHERE p.store_id = ?

        ORDER BY p.name ASC
        `,
        [storeId]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Report Summary
|--------------------------------------------------------------------------
|
| Gross profit is ESTIMATED because sale_items currently stores selling_price
| but does not store the historical buying_price at the time of sale.
|
| Estimated gross profit:
| (historical sale selling price - current product buying price) * quantity
|
|--------------------------------------------------------------------------
*/

const getReportSummary = async (
    startDate,
    endDate,
    storeId
) => {

    const { start, end } = normalizeDates(startDate, endDate);

    const [[sales]] = await db.query(
        `
        SELECT
            COUNT(*) AS totalOrders,
            COALESCE(SUM(total), 0) AS totalSales
        FROM sales
        WHERE store_id = ?
        AND payment_status = 'paid'
        AND DATE(created_at) BETWEEN ? AND ?
        `,
        [storeId, start, end]
    );


    const [[items]] = await db.query(
        `
        SELECT
            COALESCE(
                SUM(
                    (
                        COALESCE(si.selling_price, 0)
                        -
                        COALESCE(p.buying_price, 0)
                    )
                    *
                    COALESCE(si.quantity, 0)
                ),
                0
            ) AS grossProfit,

            COALESCE(
                SUM(
                    COALESCE(si.selling_price, 0)
                    *
                    COALESCE(si.quantity, 0)
                ),
                0
            ) AS itemRevenue,

            COALESCE(
                SUM(si.quantity),
                0
            ) AS itemsSold

        FROM sale_items si

        INNER JOIN sales s
            ON si.sale_id = s.id
            AND si.store_id = s.store_id

        INNER JOIN products p
            ON si.product_id = p.id
            AND p.store_id = si.store_id

        WHERE si.store_id = ?
        AND s.payment_status = 'paid'
        AND DATE(s.created_at) BETWEEN ? AND ?
        `,
        [storeId, start, end]
    );


    const totalSales = Number(sales.totalSales || 0);
    const totalOrders = Number(sales.totalOrders || 0);

    return {
        totalSales,
        totalOrders,
        grossProfit: Number(items.grossProfit || 0),
        itemsSold: Number(items.itemsSold || 0),
        averageOrder: totalOrders > 0
            ? totalSales / totalOrders
            : 0,
        estimated: true
    };
};


/*
|--------------------------------------------------------------------------
| Sales Trend
|--------------------------------------------------------------------------
*/

const getSalesTrend = async (
    startDate,
    endDate,
    storeId
) => {

    const { start, end } = normalizeDates(startDate, endDate);

    const [rows] = await db.query(
        `
        SELECT
            DATE(s.created_at) AS date,
            COUNT(*) AS orders,
            COALESCE(SUM(s.total), 0) AS sales

        FROM sales s

        WHERE s.store_id = ?
        AND s.payment_status = 'paid'
        AND DATE(s.created_at) BETWEEN ? AND ?

        GROUP BY DATE(s.created_at)
        ORDER BY DATE(s.created_at) ASC
        `,
        [storeId, start, end]
    );

    return rows.map((row) => ({
        date: row.date,
        orders: Number(row.orders),
        sales: Number(row.sales)
    }));
};


/*
|--------------------------------------------------------------------------
| Sales By Category
|--------------------------------------------------------------------------
*/

const getSalesByCategory = async (
    startDate,
    endDate,
    storeId
) => {

    const { start, end } = normalizeDates(startDate, endDate);

    const [rows] = await db.query(
        `
        SELECT
            COALESCE(c.name, 'Uncategorized') AS name,

            COALESCE(
                SUM(si.quantity),
                0
            ) AS quantity,

            COALESCE(
                SUM(
                    si.selling_price * si.quantity
                ),
                0
            ) AS revenue

        FROM sale_items si

        INNER JOIN sales s
            ON si.sale_id = s.id
            AND si.store_id = s.store_id

        LEFT JOIN products p
            ON si.product_id = p.id
            AND p.store_id = si.store_id

        LEFT JOIN categories c
            ON p.category_id = c.id
            AND c.store_id = si.store_id

        WHERE si.store_id = ?
        AND s.payment_status = 'paid'
        AND DATE(s.created_at) BETWEEN ? AND ?

        GROUP BY
            COALESCE(c.name, 'Uncategorized')

        ORDER BY revenue DESC
        `,
        [storeId, start, end]
    );

    return rows.map((row) => ({
        name: row.name,
        quantity: Number(row.quantity),
        revenue: Number(row.revenue)
    }));
};


/*
|--------------------------------------------------------------------------
| Top Products
|--------------------------------------------------------------------------
*/

const getTopProducts = async (
    startDate,
    endDate,
    storeId
) => {

    const { start, end } = normalizeDates(startDate, endDate);

    const [rows] = await db.query(
        `
        SELECT
            p.id,
            p.name,
            COALESCE(c.name, 'Uncategorized') AS category,

            COALESCE(
                SUM(si.quantity),
                0
            ) AS quantity,

            COALESCE(
                SUM(
                    si.selling_price * si.quantity
                ),
                0
            ) AS revenue

        FROM sale_items si

        INNER JOIN sales s
            ON si.sale_id = s.id
            AND si.store_id = s.store_id

        INNER JOIN products p
            ON si.product_id = p.id
            AND p.store_id = si.store_id

        LEFT JOIN categories c
            ON p.category_id = c.id
            AND c.store_id = p.store_id

        WHERE si.store_id = ?
        AND s.payment_status = 'paid'
        AND DATE(s.created_at) BETWEEN ? AND ?

        GROUP BY
            p.id,
            p.name,
            c.name

        ORDER BY quantity DESC, revenue DESC
        LIMIT 10
        `,
        [storeId, start, end]
    );

    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        quantity: Number(row.quantity),
        revenue: Number(row.revenue)
    }));
};


/*
|--------------------------------------------------------------------------
| Profit Summary
|--------------------------------------------------------------------------
*/

const getProfitReport = async (
    startDate,
    endDate,
    storeId
) => {

    const summary = await getReportSummary(
        startDate,
        endDate,
        storeId
    );

    const { start, end } = normalizeDates(startDate, endDate);

    const [[expenses]] = await db.query(
        `
        SELECT
            COALESCE(SUM(amount), 0) AS expenses
        FROM expenses
        WHERE store_id = ?
        AND DATE(expense_date) BETWEEN ? AND ?
        `,
        [storeId, start, end]
    );

    const [[purchases]] = await db.query(
        `
        SELECT
            COALESCE(SUM(total_amount), 0) AS purchases
        FROM purchases
        WHERE store_id = ?
        AND status = 'Completed'
        AND DATE(created_at) BETWEEN ? AND ?
        `,
        [storeId, start, end]
    );

    return {
        revenue: summary.totalSales,
        purchases: Number(purchases.purchases || 0),
        expenses: Number(expenses.expenses || 0),
        grossProfit: summary.grossProfit,
        estimated: true
    };
};


module.exports = {
    getSalesReport,
    getPurchaseReport,
    getExpenseReport,
    getInventoryReport,
    getReportSummary,
    getSalesTrend,
    getSalesByCategory,
    getTopProducts,
    getProfitReport
};
