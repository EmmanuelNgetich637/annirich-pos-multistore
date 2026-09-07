const db = require("../config/db");

const getAllSuppliers = async (storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM suppliers
        WHERE store_id = ?
        AND status = 'active'
        ORDER BY name ASC
        `,
        [storeId]
    );

    return rows;
};

const getSupplierById = async (id, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM suppliers
        WHERE id = ?
        AND store_id = ?
        AND status = 'active'
        `,
        [id, storeId]
    );

    return rows[0];
};

const getSupplierByName = async (name, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM suppliers
        WHERE LOWER(name) = LOWER(?)
        AND store_id = ?
        AND status = 'active'
        LIMIT 1
        `,
        [name, storeId]
    );

    return rows[0];
};

const getSupplierByNameExcludingId = async (name, id, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM suppliers
        WHERE LOWER(name) = LOWER(?)
        AND id != ?
        AND store_id = ?
        AND status = 'active'
        LIMIT 1
        `,
        [name, id, storeId]
    );

    return rows[0];
};

const createSupplier = async (supplier) => {
    const {
        name,
        contact_person,
        phone,
        email,
        address,
        store_id
    } = supplier;

    const [result] = await db.query(
        `
        INSERT INTO suppliers
        (
            store_id,
            name,
            contact_person,
            phone,
            email,
            address
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            store_id,
            name,
            contact_person || null,
            phone || null,
            email || null,
            address || null
        ]
    );

    return result.insertId;
};

const updateSupplier = async (id, supplier, storeId) => {
    const {
        name,
        contact_person,
        phone,
        email,
        address
    } = supplier;

    await db.query(
        `
        UPDATE suppliers
        SET
            name = ?,
            contact_person = ?,
            phone = ?,
            email = ?,
            address = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [
            name,
            contact_person || null,
            phone || null,
            email || null,
            address || null,
            id,
            storeId
        ]
    );

    return await getSupplierById(id, storeId);
};

const deleteSupplier = async (id, storeId) => {
    await db.query(
        `
        UPDATE suppliers
        SET status = 'inactive'
        WHERE id = ?
        AND store_id = ?
        `,
        [id, storeId]
    );
};

const searchSuppliers = async (searchTerm, storeId) => {
    searchTerm = searchTerm.trim();

    const [rows] = await db.query(
        `
        SELECT *
        FROM suppliers
        WHERE store_id = ?
        AND status = 'active'
        AND (
            LOWER(name) LIKE LOWER(?)
            OR LOWER(contact_person) LIKE LOWER(?)
            OR LOWER(phone) LIKE LOWER(?)
            OR LOWER(email) LIKE LOWER(?)
            OR LOWER(address) LIKE LOWER(?)
        )
        ORDER BY name ASC
        `,
        [
            storeId,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`
        ]
    );

    return rows;
};

const getSuppliersPaginated = async (page = 1, limit = 10, storeId) => {
    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT *
        FROM suppliers
        WHERE store_id = ?
        AND status = 'active'
        ORDER BY name ASC
        LIMIT ?
        OFFSET ?
        `,
        [storeId, limit, offset]
    );

    const [[count]] = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM suppliers
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    return {
        suppliers: rows,
        total: count.total,
        page,
        limit,
        totalPages: Math.ceil(count.total / limit)
    };
};

const getSupplierStatistics = async (storeId) => {
    const [[stats]] = await db.query(
        `
        SELECT
            COUNT(*) AS totalSuppliers,
            COALESCE(SUM(status = 'active'), 0) AS activeSuppliers,
            COALESCE(SUM(status = 'inactive'), 0) AS inactiveSuppliers
        FROM suppliers
        WHERE store_id = ?
        `,
        [storeId]
    );

    return stats;
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    getSupplierByName,
    getSupplierByNameExcludingId,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    getSuppliersPaginated,
    getSupplierStatistics
};
