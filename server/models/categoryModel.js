const db = require("../config/db");

const getAllCategories = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE store_id = ?
        AND status = 'active'
        ORDER BY name ASC
        `,
        [storeId]
    );

    return rows;

};

const getCategoryById = async (id, storeId) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE id = ?
        AND store_id = ?
        AND status = 'active'
        `,
        [id, storeId]
    );

    return rows[0];

};

const getCategoryByName = async (name, storeId) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE LOWER(name) = LOWER(?)
        AND store_id = ?
        LIMIT 1
        `,
        [name, storeId]
    );

    return rows[0];

};

const createCategory = async (category) => {

    const {
        name,
        description,
        store_id
    } = category;

    const [result] = await db.query(
        `
        INSERT INTO categories
        (name, description, store_id)
        VALUES (?, ?, ?)
        `,
        [
            name,
            description || null,
            store_id
        ]
    );

    return result.insertId;

};

const getCategoryByNameExcludingId = async (
    name,
    id,
    storeId
) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE LOWER(name) = LOWER(?)
        AND id != ?
        AND store_id = ?
        LIMIT 1
        `,
        [name, id, storeId]
    );

    return rows[0];

};

const updateCategory = async (
    id,
    category,
    storeId
) => {

    const {
        name,
        description
    } = category;

    const [result] = await db.query(
        `
        UPDATE categories
        SET
            name = ?,
            description = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [
            name,
            description || null,
            id,
            storeId
        ]
    );

    return result;

};

const deleteCategory = async (
    id,
    storeId
) => {

    const [result] = await db.query(
        `
        UPDATE categories
        SET status = 'inactive'
        WHERE id = ?
        AND store_id = ?
        `,
        [id, storeId]
    );

    return result;

};

const searchCategories = async (
    searchTerm,
    storeId
) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE store_id = ?
        AND status = 'active'
        AND (
            name LIKE ?
            OR description LIKE ?
        )
        ORDER BY name ASC
        `,
        [
            storeId,
            `%${searchTerm}%`,
            `%${searchTerm}%`
        ]
    );

    return rows;

};

const getCategoriesPaginated = async (
    page = 1,
    limit = 10,
    storeId
) => {

    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE store_id = ?
        AND status = 'active'
        ORDER BY name ASC
        LIMIT ?
        OFFSET ?
        `,
        [
            storeId,
            Number(limit),
            Number(offset)
        ]
    );

    const [[count]] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM categories
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    return {
        categories: rows,
        total: count.total
    };

};

const getCategoryStatistics = async (storeId) => {

    const [[total]] = await db.query(
        `
        SELECT COUNT(*) AS totalCategories
        FROM categories
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[active]] = await db.query(
        `
        SELECT COUNT(*) AS activeCategories
        FROM categories
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    const [[inactive]] = await db.query(
        `
        SELECT COUNT(*) AS inactiveCategories
        FROM categories
        WHERE store_id = ?
        AND status = 'inactive'
        `,
        [storeId]
    );

    const [[withProducts]] = await db.query(
        `
        SELECT COUNT(DISTINCT category_id) AS categoriesWithProducts
        FROM products
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    const emptyCategories =
        active.activeCategories -
        withProducts.categoriesWithProducts;

    return {
        ...total,
        ...active,
        ...inactive,
        ...withProducts,
        emptyCategories
    };

};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    getCategoryByNameExcludingId,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    getCategoriesPaginated,
    getCategoryStatistics
};
