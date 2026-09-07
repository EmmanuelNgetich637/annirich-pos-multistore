const db = require("../config/db");

const getAllCustomers = async (storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
        WHERE store_id = ?
        AND status = 'active'
        ORDER BY name ASC
        `,
        [storeId]
    );

    return rows;
};

const getCustomerById = async (id, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
        WHERE id = ?
        AND store_id = ?
        AND status = 'active'
        LIMIT 1
        `,
        [id, storeId]
    );

    return rows[0];
};

const getCustomerByPhone = async (phone, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
        WHERE phone = ?
        AND store_id = ?
        LIMIT 1
        `,
        [phone, storeId]
    );

    return rows[0];
};

const getCustomerByEmail = async (email, storeId) => {
    if (!email) return null;

    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
        WHERE email = ?
        AND store_id = ?
        LIMIT 1
        `,
        [email, storeId]
    );

    return rows[0];
};

const createCustomer = async (customer) => {
    const {
        name,
        phone,
        email,
        address,
        store_id
    } = customer;

    const [result] = await db.query(
        `
        INSERT INTO customers
        (
            store_id,
            name,
            phone,
            email,
            address
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            store_id,
            name,
            phone,
            email || null,
            address || null
        ]
    );

    return result.insertId;
};

const getCustomerByPhoneExcludingId = async (
    phone,
    id,
    storeId
) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
        WHERE phone = ?
        AND id != ?
        AND store_id = ?
        LIMIT 1
        `,
        [phone, id, storeId]
    );

    return rows[0];
};

const getCustomerByEmailExcludingId = async (
    email,
    id,
    storeId
) => {
    if (!email) return null;

    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
        WHERE email = ?
        AND id != ?
        AND store_id = ?
        LIMIT 1
        `,
        [email, id, storeId]
    );

    return rows[0];
};

const updateCustomer = async (
    id,
    customer,
    storeId
) => {
    const {
        name,
        phone,
        email,
        address
    } = customer;

    await db.query(
        `
        UPDATE customers
        SET
            name = ?,
            phone = ?,
            email = ?,
            address = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [
            name,
            phone,
            email || null,
            address || null,
            id,
            storeId
        ]
    );

    return await getCustomerById(id, storeId);
};

const deleteCustomer = async (id, storeId) => {
    const [result] = await db.query(
        `
        UPDATE customers
        SET status = 'inactive'
        WHERE id = ?
        AND store_id = ?
        AND status = 'active'
        `,
        [id, storeId]
    );

    return result.affectedRows;
};

const searchCustomers = async (
    keyword,
    storeId
) => {
    const search = `%${keyword}%`;

    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
        WHERE store_id = ?
        AND status = 'active'
        AND (
            name LIKE ?
            OR phone LIKE ?
            OR email LIKE ?
        )
        ORDER BY name ASC
        `,
        [
            storeId,
            search,
            search,
            search
        ]
    );

    return rows;
};

const getCustomersPaginated = async (
    page,
    limit,
    storeId
) => {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
        `
        SELECT *
        FROM customers
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
        FROM customers
        WHERE store_id = ?
        AND status = 'active'
        `,
        [storeId]
    );

    return {
        customers: rows,
        total: count.total
    };
};

const getCustomerStatistics = async (storeId) => {
    const [[stats]] = await db.query(
        `
        SELECT
            COUNT(*) AS totalCustomers,
            COALESCE(SUM(status = 'active'), 0)
                AS activeCustomers,
            COALESCE(SUM(status = 'inactive'), 0)
                AS inactiveCustomers
        FROM customers
        WHERE store_id = ?
        `,
        [storeId]
    );

    return {
        totalCustomers: stats.totalCustomers,
        activeCustomers: stats.activeCustomers,
        inactiveCustomers: stats.inactiveCustomers
    };
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    getCustomerByPhone,
    getCustomerByEmail,
    createCustomer,
    getCustomerByPhoneExcludingId,
    getCustomerByEmailExcludingId,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomersPaginated,
    getCustomerStatistics
};
