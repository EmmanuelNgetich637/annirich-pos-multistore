const db = require("../config/db");


/*
|--------------------------------------------------------------------------
| Get All Categories
|--------------------------------------------------------------------------
| Returns both active and inactive categories for the current store.
| Includes the number of active products assigned to each category.
|--------------------------------------------------------------------------
*/
const getAllCategories = async (storeId) => {

    const [rows] = await db.query(
        `
        SELECT
            c.*,
            COUNT(
                CASE
                    WHEN p.status = 'active'
                    THEN p.id
                END
            ) AS product_count
        FROM categories c
        LEFT JOIN products p
            ON p.category_id = c.id
            AND p.store_id = c.store_id
        WHERE c.store_id = ?
        GROUP BY
            c.id,
            c.store_id,
            c.name,
            c.description,
            c.status
        ORDER BY c.name ASC
        `,
        [storeId]
    );

    return rows;
}; 


/*
|--------------------------------------------------------------------------
| Get Category By ID
|--------------------------------------------------------------------------
| Returns only active categories.
|--------------------------------------------------------------------------
*/
const getCategoryById = async (
    id,
    storeId
) => {

    const [rows] = await db.query(
        `
        SELECT
            c.*,
            COUNT(
                CASE
                    WHEN p.status = 'active'
                    THEN p.id
                END
            ) AS product_count

        FROM categories c

        LEFT JOIN products p
            ON p.category_id = c.id
            AND p.store_id = c.store_id

        WHERE c.id = ?
        AND c.store_id = ?
        AND c.status = 'active'

        GROUP BY
            c.id,
            c.store_id,
            c.name,
            c.description,
            c.status,
            c.created_at
        `,
        [
            id,
            storeId
        ]
    );

    return rows[0];

};


/*
|--------------------------------------------------------------------------
| Get Category By Name
|--------------------------------------------------------------------------
*/
const getCategoryByName = async (
    name,
    storeId
) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM categories
        WHERE LOWER(name) = LOWER(?)
        AND store_id = ?
        LIMIT 1
        `,
        [
            name,
            storeId
        ]
    );

    return rows[0];

};


/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/
const createCategory = async (
    category
) => {

    const {
        name,
        description,
        store_id
    } = category;

    const [result] = await db.query(
        `
        INSERT INTO categories
        (
            name,
            description,
            store_id
        )
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


/*
|--------------------------------------------------------------------------
| Get Category By Name Excluding ID
|--------------------------------------------------------------------------
*/
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
        [
            name,
            id,
            storeId
        ]
    );

    return rows[0];

};


/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/
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


/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
| Soft delete.
|--------------------------------------------------------------------------
*/
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
        [
            id,
            storeId
        ]
    );

    return result;

};


/*
|--------------------------------------------------------------------------
| Search Categories
|--------------------------------------------------------------------------
| Search only active categories.
|--------------------------------------------------------------------------
*/
const searchCategories = async (
    searchTerm,
    storeId
) => {

    const [rows] = await db.query(
        `
        SELECT
            c.*,
            COUNT(
                CASE
                    WHEN p.status = 'active'
                    THEN p.id
                END
            ) AS product_count

        FROM categories c

        LEFT JOIN products p
            ON p.category_id = c.id
            AND p.store_id = c.store_id

        WHERE c.store_id = ?
        AND c.status = 'active'
        AND (
            c.name LIKE ?
            OR c.description LIKE ?
        )

        GROUP BY
            c.id,
            c.store_id,
            c.name,
            c.description,
            c.status,
            c.created_at

        ORDER BY c.name ASC
        `,
        [
            storeId,
            `%${searchTerm}%`,
            `%${searchTerm}%`
        ]
    );

    return rows;

};


/*
|--------------------------------------------------------------------------
| Get Categories Paginated
|--------------------------------------------------------------------------
| Returns active categories with product counts.
|--------------------------------------------------------------------------
*/
const getCategoriesPaginated = async (
    page = 1,
    limit = 10,
    storeId
) => {

    const offset =
        (page - 1) * limit;


    const [rows] = await db.query(
        `
        SELECT
            c.*,
            COUNT(
                CASE
                    WHEN p.status = 'active'
                    THEN p.id
                END
            ) AS product_count

        FROM categories c

        LEFT JOIN products p
            ON p.category_id = c.id
            AND p.store_id = c.store_id

        WHERE c.store_id = ?
        AND c.status = 'active'

        GROUP BY
            c.id,
            c.store_id,
            c.name,
            c.description,
            c.status,
            c.created_at

        ORDER BY c.name ASC

        LIMIT ?
        OFFSET ?
        `,
        [
            storeId,
            Number(limit),
            Number(offset)
        ]
    );


    const [[count]] =
        await db.query(
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


/*
|--------------------------------------------------------------------------
| Get Category Statistics
|--------------------------------------------------------------------------
| All statistics are restricted to the current store.
|--------------------------------------------------------------------------
*/
const getCategoryStatistics = async (
    storeId
) => {

    /*
    |--------------------------------------------------------------------------
    | Total Categories
    |--------------------------------------------------------------------------
    */
    const [[total]] =
        await db.query(
            `
            SELECT
                COUNT(*) AS totalCategories
            FROM categories
            WHERE store_id = ?
            `,
            [storeId]
        );


    /*
    |--------------------------------------------------------------------------
    | Active Categories
    |--------------------------------------------------------------------------
    */
    const [[active]] =
        await db.query(
            `
            SELECT
                COUNT(*) AS activeCategories
            FROM categories
            WHERE store_id = ?
            AND status = 'active'
            `,
            [storeId]
        );


    /*
    |--------------------------------------------------------------------------
    | Inactive Categories
    |--------------------------------------------------------------------------
    */
    const [[inactive]] =
        await db.query(
            `
            SELECT
                COUNT(*) AS inactiveCategories
            FROM categories
            WHERE store_id = ?
            AND status = 'inactive'
            `,
            [storeId]
        );


    /*
    |--------------------------------------------------------------------------
    | Categories With Active Products
    |--------------------------------------------------------------------------
    */
    const [[withProducts]] =
        await db.query(
            `
            SELECT
                COUNT(DISTINCT category_id)
                    AS categoriesWithProducts

            FROM products

            WHERE store_id = ?
            AND status = 'active'
            `,
            [storeId]
        );


    /*
    |--------------------------------------------------------------------------
    | Total Active Products Assigned To Categories
    |--------------------------------------------------------------------------
    */
    const [[assignedProducts]] =
        await db.query(
            `
            SELECT
                COUNT(*) AS productsAssigned

            FROM products

            WHERE store_id = ?
            AND status = 'active'
            AND category_id IS NOT NULL
            `,
            [storeId]
        );


    /*
    |--------------------------------------------------------------------------
    | Empty Active Categories
    |--------------------------------------------------------------------------
    */
    const emptyCategories =
        Math.max(
            Number(active.activeCategories) -
            Number(withProducts.categoriesWithProducts),
            0
        );


    /*
    |--------------------------------------------------------------------------
    | Return Statistics
    |--------------------------------------------------------------------------
    */
    return {

        ...total,

        ...active,

        ...inactive,

        ...withProducts,

        ...assignedProducts,

        emptyCategories

    };

};


/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/
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