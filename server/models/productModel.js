const db = require("../config/db");

// ==========================
// Create Product
// ==========================
const createProduct = async (product) => {

    const {
        barcode,
        name,
        category_id,
        buying_price,
        selling_price,
        quantity,
        minimum_stock,
        unit,
        image,
        description,
        store_id
    } = product;

    const [result] = await db.query(
        `
        INSERT INTO products
        (
            barcode,
            name,
            category_id,
            buying_price,
            selling_price,
            quantity,
            minimum_stock,
            unit,
            image,
            description,
            store_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            barcode,
            name,
            category_id,
            buying_price,
            selling_price,
            quantity,
            minimum_stock,
            unit,
            image,
            description,
            store_id
        ]
    );

    return result.insertId;

};

// ==========================
// Get All Products
// ==========================
const getAllProducts = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            products.*,
            categories.name AS category_name
        FROM products
        JOIN categories
            ON products.category_id = categories.id
            AND categories.store_id = products.store_id
        WHERE products.store_id = ?
        ORDER BY products.id DESC
        `,
        [storeId]
    );

    return rows;

};

// ==========================
// Get Product By ID
// ==========================
const getProductById = async (id, storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            products.*,
            categories.name AS category_name
        FROM products
        JOIN categories
            ON products.category_id = categories.id
            AND categories.store_id = products.store_id
        WHERE products.id = ?
        AND products.store_id = ?
        `,
        [id, storeId]
    );

    return rows[0];

};

// ==========================
// Update Product
// ==========================
const updateProduct = async (
    id,
    product,
    storeId
) => {

    const fields = [];
    const values = [];

    // Fields that are allowed to be updated
    const allowedFields = [
        "barcode",
        "name",
        "category_id",
        "buying_price",
        "selling_price",
        "quantity",
        "minimum_stock",
        "unit",
        "image",
        "description",
        "status"
    ];

    allowedFields.forEach((key) => {

        if (product[key] !== undefined) {

            fields.push(`${key} = ?`);
            values.push(product[key]);

        }

    });

    if (fields.length === 0) {
        return null;
    }

    values.push(id);
    values.push(storeId);

    const [result] = await db.query(
        `
        UPDATE products
        SET ${fields.join(", ")}
        WHERE id = ?
        AND store_id = ?
        `,
        values
    );

    return result;

};

// ==========================
// Delete Product
// ==========================
const deleteProduct = async (
    id,
    storeId
) => {

    const [result] = await db.query(
        `
        UPDATE products
        SET status = 'inactive'
        WHERE id = ?
        AND store_id = ?
        `,
        [id, storeId]
    );

    return result;

};

// ==========================
// Search Products
// ==========================
const searchProducts = async (
    searchTerm,
    storeId
) => {

    const [rows] = await db.query(
        `
        SELECT
            products.*,
            categories.name AS category_name
        FROM products
        JOIN categories
            ON products.category_id = categories.id
            AND categories.store_id = products.store_id
        WHERE products.store_id = ?
        AND products.status = 'active'
        AND (
            products.name LIKE ?
            OR products.barcode LIKE ?
            OR categories.name LIKE ?
        )
        ORDER BY products.name ASC
        `,
        [
            storeId,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`
        ]
    );

    return rows;

};

// ==========================
// Paginated Products
// ==========================
const getProductsPaginated = async (
    page = 1,
    limit = 10,
    storeId
) => {

    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT
            products.*,
            categories.name AS category_name
        FROM products
        JOIN categories
            ON products.category_id = categories.id
            AND categories.store_id = products.store_id
        WHERE products.store_id = ?
        AND products.status = 'active'
        ORDER BY products.id DESC
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
        FROM products
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    return {
        products: rows,
        total: count[0].total
    };

};

// ==========================
// Update Product Image
// ==========================
const updateProductImage = async (
    id,
    image,
    storeId
) => {

    const [result] = await db.query(
        `
        UPDATE products
        SET image = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [
            image,
            id,
            storeId
        ]
    );

    return result;

};

// ==========================
// Low Stock Products
// ==========================
const getLowStockProducts = async (
    storeId
) => {

    const [rows] = await db.query(
        `
        SELECT
            products.*,
            categories.name AS category_name
        FROM products
        JOIN categories
            ON products.category_id = categories.id
            AND categories.store_id = products.store_id
        WHERE products.store_id = ?
        AND products.status = 'active'
        AND products.quantity <= products.minimum_stock
        ORDER BY products.quantity ASC
        `,
        [storeId]
    );

    return rows;

};

// ==========================
// Product Statistics
// ==========================
const getProductStatistics = async (
    storeId
) => {

    const [[total]] = await db.query(
        `
        SELECT COUNT(*) AS totalProducts
        FROM products
        WHERE store_id = ?
        `,
        [storeId]
    );

    const [[active]] = await db.query(
        `
        SELECT COUNT(*) AS activeProducts
        FROM products
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    const [[inactive]] = await db.query(
        `
        SELECT COUNT(*) AS inactiveProducts
        FROM products
        WHERE store_id = ?
        AND status = 'inactive'
        `,
        [storeId]
    );

    const [[lowStock]] = await db.query(
        `
        SELECT COUNT(*) AS lowStockProducts
        FROM products
        WHERE store_id = ?
        AND status = 'active'
        AND quantity <= minimum_stock
        `,
        [storeId]
    );

    const [[outOfStock]] = await db.query(
        `
        SELECT COUNT(*) AS outOfStockProducts
        FROM products
        WHERE store_id = ?
        AND status = 'active'
        AND quantity = 0
        `,
        [storeId]
    );

    const [[inventory]] = await db.query(
        `
        SELECT
            IFNULL(
                SUM(quantity * buying_price),
                0
            ) AS inventoryValue
        FROM products
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    return {
        ...total,
        ...active,
        ...inactive,
        ...lowStock,
        ...outOfStock,
        ...inventory
    };

};

// ==========================
// Count Products By Category
// ==========================
const countProductsByCategory = async (
    categoryId,
    storeId
) => {

    const [[result]] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM products
        WHERE category_id = ?
        AND store_id = ?
        AND status = 'active'
        `,
        [
            categoryId,
            storeId
        ]
    );

    return result.total;

};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsPaginated,
    updateProductImage,
    getLowStockProducts,
    getProductStatistics,
    countProductsByCategory
};