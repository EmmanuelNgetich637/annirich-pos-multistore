const db = require("../config/db");

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

const getDashboardSummary = async (storeId) => {

    const [[products]] = await db.query(
        `
        SELECT COUNT(*) AS totalProducts
        FROM products
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[categories]] = await db.query(
        `
        SELECT COUNT(*) AS totalCategories
        FROM categories
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[customers]] = await db.query(
        `
        SELECT COUNT(*) AS totalCustomers
        FROM customers
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[suppliers]] = await db.query(
        `
        SELECT COUNT(*) AS totalSuppliers
        FROM suppliers
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[sales]] = await db.query(
        `
        SELECT
            COUNT(*) AS totalSales,
            IFNULL(SUM(total), 0) AS salesRevenue
        FROM sales
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[purchases]] = await db.query(
        `
        SELECT
            COUNT(*) AS totalPurchases,
            IFNULL(SUM(total_amount), 0) AS purchaseCost
        FROM purchases
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[expenses]] = await db.query(
        `
        SELECT
            COUNT(*) AS totalExpenses,
            IFNULL(SUM(amount), 0) AS expenseAmount
        FROM expenses
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[lowStock]] = await db.query(
        `
        SELECT COUNT(*) AS lowStockItems
        FROM products
        WHERE store_id = ?
        AND quantity <= minimum_stock
        `,
        [storeId]
    );

    return {
        totalProducts: Number(products.totalProducts),

        totalCategories: Number(categories.totalCategories),

        totalCustomers: Number(customers.totalCustomers),

        totalSuppliers: Number(suppliers.totalSuppliers),

        totalSales: Number(sales.totalSales),

        salesRevenue: Number(sales.salesRevenue),

        totalPurchases: Number(purchases.totalPurchases),

        purchaseCost: Number(purchases.purchaseCost),

        totalExpenses: Number(expenses.totalExpenses),

        expenseAmount: Number(expenses.expenseAmount),

        lowStockItems: Number(lowStock.lowStockItems)
    };
};


/*
|--------------------------------------------------------------------------
| Recent Sales
|--------------------------------------------------------------------------
*/

const getRecentSales = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            s.id,
            s.store_id,
            c.name AS customer_name,
            s.total,
            s.payment_method,
            s.created_at
        FROM sales s
        LEFT JOIN customers c
            ON s.customer_id = c.id
            AND c.store_id = s.store_id
        WHERE s.store_id = ?
        ORDER BY s.created_at DESC
        LIMIT 10
        `,
        [storeId]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Recent Purchases
|--------------------------------------------------------------------------
*/

const getRecentPurchases = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            p.id,
            p.store_id,
            s.name AS supplier_name,
            p.invoice_number,
            p.total_amount,
            p.created_at
        FROM purchases p
        LEFT JOIN suppliers s
            ON p.supplier_id = s.id
            AND s.store_id = p.store_id
        WHERE p.store_id = ?
        ORDER BY p.created_at DESC
        LIMIT 10
        `,
        [storeId]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Low Stock Products
|--------------------------------------------------------------------------
*/

const getLowStockProducts = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            id,
            store_id,
            name,
            quantity,
            minimum_stock
        FROM products
        WHERE store_id = ?
        AND quantity <= minimum_stock
        ORDER BY quantity ASC
        `,
        [storeId]
    );

    return rows;
};


/*
|--------------------------------------------------------------------------
| Monthly Sales
|--------------------------------------------------------------------------
*/

const getMonthlySales = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            COUNT(*) AS totalSales,
            IFNULL(SUM(total), 0) AS revenue
        FROM sales
        WHERE store_id = ?
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
        `,
        [storeId]
    );

    return rows;
};


module.exports = {

    getDashboardSummary,

    getRecentSales,

    getRecentPurchases,

    getLowStockProducts,

    getMonthlySales

};