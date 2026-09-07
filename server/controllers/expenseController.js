const expenseService =
    require("../services/expenseService");

const logActivity =
    require("../utils/activityLogger");


// Create Expense
const createExpense = async (req, res) => {

    try {

        const expense =
            await expenseService.createExpense(
                req.body,
                req.storeId
            );

        await logActivity({
            user_id: req.user.id,
            action: "CREATE",
            module: "Expenses",
            description:
                `Created expense ID ${expense.id}`,
            ip_address: req.ip
        });

        res.status(201).json({
            success: true,
            message: "Expense created successfully.",
            data: expense
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// Get All Expenses
const getExpenses = async (req, res) => {

    try {

        const expenses =
            await expenseService.getExpenses(
                req.storeId
            );

        res.json({
            success: true,
            count: expenses.length,
            data: expenses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Get Expense By ID
const getExpense = async (req, res) => {

    try {

        const expense =
            await expenseService.getExpense(
                req.params.id,
                req.storeId
            );

        res.json({
            success: true,
            data: expense
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


// Update Expense
const updateExpense = async (req, res) => {

    try {

        const expense =
            await expenseService.updateExpense(
                req.params.id,
                req.body,
                req.storeId
            );

        await logActivity({
            user_id: req.user.id,
            action: "UPDATE",
            module: "Expenses",
            description:
                `Updated expense ID ${req.params.id}`,
            ip_address: req.ip
        });

        res.json({
            success: true,
            message: "Expense updated successfully.",
            data: expense
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


// Delete Expense
const deleteExpense = async (req, res) => {

    try {

        await expenseService.deleteExpense(
            req.params.id,
            req.storeId
        );

        await logActivity({
            user_id: req.user.id,
            action: "DELETE",
            module: "Expenses",
            description:
                `Deleted expense ID ${req.params.id}`,
            ip_address: req.ip
        });

        res.json({
            success: true,
            message: "Expense deleted successfully."
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }
};


// Search Expenses
const searchExpenses = async (req, res) => {

    try {

        const expenses =
            await expenseService.searchExpenses(
                req.query.keyword || "",
                req.storeId
            );

        res.json({
            success: true,
            count: expenses.length,
            data: expenses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Pagination
const getExpensesPaginated =
async (req, res) => {

    try {

        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const result =
            await expenseService.getExpensesPaginated(
                page,
                limit,
                req.storeId
            );

        res.json({
            success: true,
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
            count: result.data.length,
            data: result.data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// Statistics
const getExpenseStatistics =
async (req, res) => {

    try {

        const stats =
            await expenseService.getExpenseStatistics(
                req.storeId
            );

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
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