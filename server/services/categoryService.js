const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

const getCategories = async (storeId) => {

    return await Category.getAllCategories(storeId);

};

const getCategory = async (id, storeId) => {

    const category =
        await Category.getCategoryById(id, storeId);

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;

};

const createCategory = async (data, storeId) => {

    const exists =
        await Category.getCategoryByName(
            data.name,
            storeId
        );

    if (exists) {
        throw new Error("Category already exists.");
    }

    const id =
        await Category.createCategory({
            ...data,
            store_id: storeId
        });

    return await Category.getCategoryById(
        id,
        storeId
    );

};

const updateCategory = async (
    id,
    data,
    storeId
) => {

    const category =
        await Category.getCategoryById(
            id,
            storeId
        );

    if (!category) {
        throw new Error("Category not found.");
    }

    const duplicate =
        await Category.getCategoryByNameExcludingId(
            data.name,
            id,
            storeId
        );

    if (duplicate) {
        throw new Error(
            "Category name already exists."
        );
    }

    await Category.updateCategory(
        id,
        data,
        storeId
    );

    return await Category.getCategoryById(
        id,
        storeId
    );

};

const deleteCategory = async (
    id,
    storeId
) => {

    const category =
        await Category.getCategoryById(
            id,
            storeId
        );

    if (!category) {
        throw new Error("Category not found.");
    }

    const totalProducts =
        await Product.countProductsByCategory(
            id,
            storeId
        );

    if (totalProducts > 0) {
        throw new Error(
            "Cannot delete category. Active products are assigned to it."
        );
    }

    await Category.deleteCategory(
        id,
        storeId
    );

};

const searchCategories = async (
    query,
    storeId
) => {

    return await Category.searchCategories(
        query,
        storeId
    );

};

const getCategoriesPaginated = async (
    page,
    limit,
    storeId
) => {

    return await Category.getCategoriesPaginated(
        page,
        limit,
        storeId
    );

};

const getCategoryStatistics = async (storeId) => {

    return await Category.getCategoryStatistics(
        storeId
    );

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
