const supplierService = require("../services/supplierService");

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierService.getSuppliers(
            req.storeId
        );

        res.json({
            success: true,
            count: suppliers.length,
            data: suppliers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSupplier = async (req, res) => {
    try {
        const supplier = await supplierService.getSupplier(
            req.params.id,
            req.storeId
        );

        res.json({
            success: true,
            data: supplier
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const createSupplier = async (req, res) => {
    try {
        const supplier = await supplierService.createSupplier(
            req.body,
            req.storeId
        );

        res.status(201).json({
            success: true,
            message: "Supplier created successfully.",
            data: supplier
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const supplier = await supplierService.updateSupplier(
            req.params.id,
            req.body,
            req.storeId
        );

        res.json({
            success: true,
            message: "Supplier updated successfully.",
            data: supplier
        });
    } catch (error) {
        const status =
            error.message === "Supplier not found."
                ? 404
                : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        await supplierService.deleteSupplier(
            req.params.id,
            req.storeId
        );

        res.json({
            success: true,
            message: "Supplier deleted successfully."
        });
    } catch (error) {
        const status =
            error.message === "Supplier not found."
                ? 404
                : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const searchSuppliers = async (req, res) => {
    try {
        const q = req.query.q || "";

        const suppliers = await supplierService.searchSuppliers(
            q,
            req.storeId
        );

        res.json({
            success: true,
            count: suppliers.length,
            data: suppliers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSuppliersPaginated = async (req, res) => {
    try {
        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 10, 1),
            100
        );

        const result = await supplierService.getSuppliersPaginated(
            page,
            limit,
            req.storeId
        );

        res.json({
            success: true,
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
            count: result.suppliers.length,
            data: result.suppliers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSupplierStatistics = async (req, res) => {
    try {
        const stats = await supplierService.getSupplierStatistics(
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
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    getSuppliersPaginated,
    getSupplierStatistics
};
