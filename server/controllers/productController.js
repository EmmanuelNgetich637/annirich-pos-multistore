const Product = require("../models/productModel");
const productService = require("../services/productService");
const logActivity = require("../utils/activityLogger");

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

const createProduct = async (req, res) => {

    try {

        const id = await productService.createProduct(
            req.body,
            req.storeId
        );

        await logActivity({
            user_id: req.user.id,
            action: "CREATE",
            module: "Products",
            description: `Created product ID ${id}`,
            ip_address: req.ip
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            productId: id
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/

const getProducts = async (req, res) => {

    try {

        const products = await productService.getProducts(
            req.storeId
        );

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Get Product By ID
|--------------------------------------------------------------------------
*/

const getProduct = async (req, res) => {

    try {

        const product = await productService.getProduct(
            req.params.id,
            req.storeId
        );

        res.json({
            success: true,
            data: product
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

const updateProduct = async (req, res) => {

    try {

        const product = await productService.updateProduct(
            req.params.id,
            req.body,
            req.storeId
        );

        await logActivity({
            user_id: req.user.id,
            action: "UPDATE",
            module: "Products",
            description: `Updated product ID ${req.params.id}`,
            ip_address: req.ip
        });

        res.json({
            success: true,
            message: "Product updated successfully.",
            data: product
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

const deleteProduct = async (req, res) => {

    try {

        await productService.deleteProduct(
            req.params.id,
            req.storeId
        );

        await logActivity({
            user_id: req.user.id,
            action: "DELETE",
            module: "Products",
            description: `Deleted product ID ${req.params.id}`,
            ip_address: req.ip
        });

        res.json({
            success: true,
            message: "Product deleted successfully."
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Search Products
|--------------------------------------------------------------------------
*/

const searchProducts = async (req, res) => {

    try {

        const q = req.query.q || "";

        const products = await productService.searchProducts(
            q,
            req.storeId
        );

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

const getProductsPaginated = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result =
            await productService.getProductsPaginated(
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
            count: result.products.length,
            data: result.products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Update Product Image
|--------------------------------------------------------------------------
*/

const updateProductImage = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Please upload an image."
            });

        }

        const product =
            await productService.updateProductImage(
                req.params.id,
                req.file,
                req.storeId
            );

        await logActivity({
            user_id: req.user.id,
            action: "UPDATE IMAGE",
            module: "Products",
            description:
                `Updated image for product ID ${req.params.id}`,
            ip_address: req.ip
        });

        res.json({
            success: true,
            message: "Product image updated successfully.",
            data: product
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Low Stock Products
|--------------------------------------------------------------------------
*/

const getLowStockProducts = async (req, res) => {

    try {

        const products =
            await productService.getLowStockProducts(
                req.storeId
            );

        res.json({
            success: true,
            count: products.length,
            data: products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Product Statistics
|--------------------------------------------------------------------------
*/

const getProductStatistics = async (req, res) => {

    try {

        const stats =
            await productService.getProductStatistics(
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

    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsPaginated,
    updateProductImage,
    getLowStockProducts,
    getProductStatistics

};