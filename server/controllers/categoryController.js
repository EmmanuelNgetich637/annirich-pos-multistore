const categoryService = require("../services/categoryService");

const getCategories = async (req, res) => {

    try {

        const categories =
            await categoryService.getCategories(
                req.storeId
            );

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getCategory = async (req, res) => {

    try {

        const category =
            await categoryService.getCategory(
                req.params.id,
                req.storeId
            );

        res.json({
            success: true,
            data: category
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};

const createCategory = async (req, res) => {

    try {

        const category =
            await categoryService.createCategory(
                req.body,
                req.storeId
            );

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: category
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const updateCategory = async (req, res) => {

    try {

        const category =
            await categoryService.updateCategory(
                req.params.id,
                req.body,
                req.storeId
            );

        res.json({
            success: true,
            message: "Category updated successfully.",
            data: category
        });

    } catch (error) {

        const status =
            error.message === "Category not found."
                ? 404
                : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });

    }

};

const deleteCategory = async (req, res) => {

    try {

        await categoryService.deleteCategory(
            req.params.id,
            req.storeId
        );

        res.json({
            success: true,
            message: "Category deleted successfully."
        });

    } catch (error) {

        const status =
            error.message === "Category not found."
                ? 404
                : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });

    }

};

const searchCategories = async (req, res) => {

    try {

        const q = req.query.q || "";

        const categories =
            await categoryService.searchCategories(
                q,
                req.storeId
            );

        res.json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getCategoriesPaginated = async (req, res) => {

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
            await categoryService.getCategoriesPaginated(
                page,
                limit,
                req.storeId
            );

        res.json({
            success: true,
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(
                result.total / limit
            ),
            count: result.categories.length,
            data: result.categories
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getCategoryStatistics = async (req, res) => {

    try {

        const stats =
            await categoryService.getCategoryStatistics(
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
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    getCategoriesPaginated,
    getCategoryStatistics
};
