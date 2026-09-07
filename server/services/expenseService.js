const Expense = require("../models/expenseModel");


// Create Expense
const createExpense = async (data, storeId) => {

    const {
        expense_name,
        amount,
        description,
        expense_date
    } = data;

    if (!expense_name) {
        throw new Error("Expense name is required.");
    }

    if (
        amount === undefined ||
        amount === null ||
        Number(amount) < 0
    ) {
        throw new Error("Invalid expense amount.");
    }

    if (!expense_date) {
        throw new Error("Expense date is required.");
    }

    const expenseId = await Expense.createExpense({
        store_id: storeId,
        expense_name,
        amount,
        description,
        expense_date
    });

    return {
        id: expenseId,
        store_id: storeId,
        expense_name,
        amount,
        description,
        expense_date
    };
};


// Get All Expenses
const getExpenses = async (storeId) => {
    return await Expense.getAllExpenses(storeId);
};


// Get Expense By ID
const getExpense = async (id, storeId) => {

    const expense =
        await Expense.getExpenseById(id, storeId);

    if (!expense) {
        throw new Error("Expense not found.");
    }

    return expense;
};


// Update Expense
const updateExpense = async (
    id,
    data,
    storeId
) => {

    const expense =
        await Expense.getExpenseById(id, storeId);

    if (!expense) {
        throw new Error("Expense not found.");
    }

    if (!data.expense_name) {
        throw new Error("Expense name is required.");
    }

    if (
        data.amount === undefined ||
        data.amount === null ||
        Number(data.amount) < 0
    ) {
        throw new Error("Invalid expense amount.");
    }

    if (!data.expense_date) {
        throw new Error("Expense date is required.");
    }

    await Expense.updateExpense(
        id,
        data,
        storeId
    );

    return await Expense.getExpenseById(
        id,
        storeId
    );
};


// Delete Expense
const deleteExpense = async (
    id,
    storeId
) => {

    const expense =
        await Expense.getExpenseById(
            id,
            storeId
        );

    if (!expense) {
        throw new Error("Expense not found.");
    }

    await Expense.deleteExpense(
        id,
        storeId
    );
};


// Search Expenses
const searchExpenses = async (
    keyword,
    storeId
) => {

    return await Expense.searchExpenses(
        keyword,
        storeId
    );
};


// Pagination
const getExpensesPaginated = async (
    page,
    limit,
    storeId
) => {

    return await Expense.getExpensesPaginated(
        page,
        limit,
        storeId
    );
};


// Statistics
const getExpenseStatistics = async (
    storeId
) => {

    return await Expense.getExpenseStatistics(
        storeId
    );
};


module.exports = {
    createExpense,
    getExpenses,
    getExpense,
    updateExpense,
    deleteExpense,
    searchExpenses,
    getExpensesPaginated,
    getExpenseStatistics
};