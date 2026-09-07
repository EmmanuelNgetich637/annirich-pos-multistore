const Product = require("../models/productModel");
const db = require("../config/db");

// ==========================
// Create Product
// ==========================
const createProduct = async (data, storeId) => {

    // Verify that the selected category belongs to this store
    const [categories] = await db.query(
        `
        SELECT id
        FROM categories
        WHERE id = ?
        AND store_id = ?
        AND status = 'active'
        `,
        [data.category_id, storeId]
    );

    if (categories.length === 0) {
        throw new Error("Category not found in this store.");
    }

    return await Product.createProduct({
        ...data,
        store_id: storeId
    });

};

// ==========================
// Get All Products
// ==========================
const getProducts = async (storeId) => {

    return await Product.getAllProducts(storeId);

};

// ==========================
// Get Product
// ==========================
const getProduct = async (id, storeId) => {

    const product = await Product.getProductById(
        id,
        storeId
    );

    if (!product) {
        throw new Error("Product not found");
    }

    return product;

};

// ==========================
// Update Product
// ==========================
const updateProduct = async (id, data, storeId) => {

    const existing = await Product.getProductById(
        id,
        storeId
    );

    if (!existing) {
        throw new Error("Product not found");
    }

    // If category is being changed, verify it belongs
    // to the authenticated store.
    if (data.category_id !== undefined) {

        const [categories] = await db.query(
            `
            SELECT id
            FROM categories
            WHERE id = ?
            AND store_id = ?
            AND status = 'active'
            `,
            [data.category_id, storeId]
        );

        if (categories.length === 0) {
            throw new Error("Category not found in this store.");
        }

    }

    // Never allow the client to change store ownership
    const safeData = { ...data };
    delete safeData.store_id;

    await Product.updateProduct(
        id,
        safeData,
        storeId
    );

    return await Product.getProductById(
        id,
        storeId
    );

};

// ==========================
// Delete Product
// ==========================
const deleteProduct = async (id, storeId) => {

    const product = await Product.getProductById(
        id,
        storeId
    );

    if (!product) {
        throw new Error("Product not found");
    }

    await Product.deleteProduct(
        id,
        storeId
    );

};

// ==========================
// Search Products
// ==========================
const searchProducts = async (query, storeId) => {

    return await Product.searchProducts(
        query,
        storeId
    );

};

// ==========================
// Pagination
// ==========================
const getProductsPaginated = async (
    page,
    limit,
    storeId
) => {

    return await Product.getProductsPaginated(
        page,
        limit,
        storeId
    );

};

// ==========================
// Update Product Image
// ==========================
const updateProductImage = async (
    id,
    file,
    storeId
) => {

    const product = await Product.getProductById(
        id,
        storeId
    );

    if (!product) {
        throw new Error("Product not found");
    }

    await Product.updateProductImage(
        id,
        file.filename,
        storeId
    );

    return await Product.getProductById(
        id,
        storeId
    );

};

// ==========================
// Low Stock Products
// ==========================
const getLowStockProducts = async (storeId) => {

    return await Product.getLowStockProducts(
        storeId
    );

};

// ==========================
// Product Statistics
// ==========================
const getProductStatistics = async (storeId) => {

    return await Product.getProductStatistics(
        storeId
    );

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