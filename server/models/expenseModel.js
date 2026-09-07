const db = require("../config/db");

// Create Expense
const createExpense = async (expense) => {
    const [result] = await db.query(
        `
        INSERT INTO expenses
        (
            store_id,
            expense_name,
            amount,
            description,
            expense_date
        )
        VALUES
        (?, ?, ?, ?, ?)
        `,
        [
            expense.store_id,
            expense.expense_name,
            expense.amount,
            expense.description,
            expense.expense_date
        ]
    );

    return result.insertId;
};


// Get All Expenses
const getAllExpenses = async (storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM expenses
        WHERE store_id = ?
        ORDER BY expense_date DESC,
                 id DESC
        `,
        [storeId]
    );

    return rows;
};


// Get Expense By ID
const getExpenseById = async (id, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM expenses
        WHERE id = ?
        AND store_id = ?
        LIMIT 1
        `,
        [id, storeId]
    );

    return rows[0];
};


// Update Expense
const updateExpense = async (id, expense, storeId) => {
    await db.query(
        `
        UPDATE expenses
        SET
            expense_name = ?,
            amount = ?,
            description = ?,
            expense_date = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [
            expense.expense_name,
            expense.amount,
            expense.description,
            expense.expense_date,
            id,
            storeId
        ]
    );
};


// Delete Expense
const deleteExpense = async (id, storeId) => {
    await db.query(
        `
        DELETE FROM expenses
        WHERE id = ?
        AND store_id = ?
        `,
        [id, storeId]
    );
};


// Search Expenses
const searchExpenses = async (keyword, storeId) => {
    const search = `%${keyword}%`;

    const [rows] = await db.query(
        `
        SELECT *
        FROM expenses
        WHERE store_id = ?
        AND (
            expense_name LIKE ?
            OR description LIKE ?
        )
        ORDER BY expense_date DESC,
                 id DESC
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
const getExpensesPaginated = async (
    page,
    limit,
    storeId
) => {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT *
        FROM expenses
        WHERE store_id = ?
        ORDER BY expense_date DESC,
                 id DESC
        LIMIT ?
        OFFSET ?
        `,
        [
            storeId,
            Number(limit),
            Number(offset)
        ]
    );

    const [count] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM expenses
        WHERE store_id = ?
        `,
        [storeId]
    );

    return {
        data: rows,
        total: count[0].total,
        page,
        limit,
        totalPages: Math.ceil(
            count[0].total / limit
        )
    };
};


// Statistics
const getExpenseStatistics = async (storeId) => {
    const [rows] = await db.query(
        `
        SELECT
            COUNT(*) AS totalExpenses,
            IFNULL(
                SUM(amount),
                0
            ) AS totalAmount
        FROM expenses
        WHERE store_id = ?
        `,
        [storeId]
    );

    return rows[0];
};


module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    searchExpenses,
    getExpensesPaginated,
    getExpenseStatistics
};