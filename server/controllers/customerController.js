const customerService = require("../services/customerService");

const getCustomers = async (req, res) => {
    try {
        const customers =
            await customerService.getCustomers(
                req.storeId
            );

        res.json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCustomer = async (req, res) => {
    try {
        const customer =
            await customerService.getCustomer(
                req.params.id,
                req.storeId
            );

        res.json({
            success: true,
            data: customer
        });
    } catch (error) {
        const status =
            error.message === "Customer not found."
                ? 404
                : 500;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const createCustomer = async (req, res) => {
    try {
        const customer =
            await customerService.createCustomer(
                req.body,
                req.storeId
            );

        res.status(201).json({
            success: true,
            message: "Customer created successfully.",
            data: customer
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customer =
            await customerService.updateCustomer(
                req.params.id,
                req.body,
                req.storeId
            );

        res.json({
            success: true,
            message: "Customer updated successfully.",
            data: customer
        });
    } catch (error) {
        const status =
            error.message === "Customer not found."
                ? 404
                : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        await customerService.deleteCustomer(
            req.params.id,
            req.storeId
        );

        res.json({
            success: true,
            message: "Customer deleted successfully."
        });
    } catch (error) {
        const status =
            error.message === "Customer not found."
                ? 404
                : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const searchCustomers = async (req, res) => {
    try {
        const keyword =
            req.query.keyword || "";

        const customers =
            await customerService.searchCustomers(
                keyword,
                req.storeId
            );

        res.json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCustomersPaginated = async (req, res) => {
    try {
        const page =
            Math.max(
                parseInt(req.query.page) || 1,
                1
            );

        const limit =
            Math.min(
                Math.max(
                    parseInt(req.query.limit) || 10,
                    1
                ),
                100
            );

        const result =
            await customerService.getCustomersPaginated(
                page,
                limit,
                req.storeId
            );

        res.json({
            success: true,
            page,
            limit,
            total: result.total,
            totalPages:
                Math.ceil(
                    result.total / limit
                ),
            data: result.customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCustomerStatistics = async (
    req,
    res
) => {
    try {
        const stats =
            await customerService.getCustomerStatistics(
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
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomersPaginated,
    getCustomerStatistics
};
