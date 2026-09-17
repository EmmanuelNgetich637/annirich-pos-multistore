const db = require("../config/db");

// Find user by email within a specific store
const findUserByEmail = async (email, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        AND store_id = ?
        LIMIT 1
        `,
        [email, storeId]
    );

    return rows[0];
};

// Find user by username within a specific store
const findUserByUsername = async (username, storeId) => {
    const [rows] = await db.query(
        `
        SELECT *
        FROM users
        WHERE username = ?
        AND store_id = ?
        LIMIT 1
        `,
        [username, storeId]
    );

    return rows[0];
};

// Get all users for a store
const getAllUsers = async (storeId) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            store_id,
            full_name,
            username,
            email,
            role,
            status,
            created_at
        FROM users
        WHERE store_id = ?
        ORDER BY created_at DESC, id DESC
        `,
        [storeId]
    );

    return rows;
};

// Get one user for a store
const getUserById = async (id, storeId) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            store_id,
            full_name,
            username,
            email,
            role,
            status,
            created_at
        FROM users
        WHERE id = ?
        AND store_id = ?
        LIMIT 1
        `,
        [id, storeId]
    );

    return rows[0];
};

// Create user
const createUser = async (user) => {
    const {
        full_name,
        username,
        email,
        password,
        role,
        store_id
    } = user;

    const [result] = await db.query(
        `
        INSERT INTO users
        (
            full_name,
            username,
            email,
            password,
            role,
            store_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            full_name,
            username,
            email,
            password,
            role,
            store_id
        ]
    );

    return result.insertId;
};

// Update user details
const updateUser = async (id, storeId, user) => {
    const {
        full_name,
        username,
        email,
        role
    } = user;

    await db.query(
        `
        UPDATE users
        SET
            full_name = ?,
            username = ?,
            email = ?,
            role = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [
            full_name,
            username,
            email,
            role,
            id,
            storeId
        ]
    );

    return getUserById(id, storeId);
};

// Update password
const updatePassword = async (id, storeId, password) => {
    await db.query(
        `
        UPDATE users
        SET password = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [password, id, storeId]
    );
};

// Update status
const updateStatus = async (id, storeId, status) => {
    await db.query(
        `
        UPDATE users
        SET status = ?
        WHERE id = ?
        AND store_id = ?
        `,
        [status, id, storeId]
    );

    return getUserById(id, storeId);
};

// Soft delete / deactivate user
const deleteUser = async (id, storeId) => {
    await db.query(
        `
        UPDATE users
        SET status = 'inactive'
        WHERE id = ?
        AND store_id = ?
        `,
        [id, storeId]
    );
};

// Search users
const searchUsers = async (searchTerm, storeId) => {
    const term = `%${searchTerm.trim()}%`;

    const [rows] = await db.query(
        `
        SELECT
            id,
            store_id,
            full_name,
            username,
            email,
            role,
            status,
            created_at
        FROM users
        WHERE store_id = ?
        AND (
            full_name LIKE ?
            OR username LIKE ?
            OR email LIKE ?
        )
        ORDER BY full_name ASC
        `,
        [
            storeId,
            term,
            term,
            term
        ]
    );

    return rows;
};

// User statistics
const getUserStatistics = async (storeId) => {
    const [[stats]] = await db.query(
        `
        SELECT
            COUNT(*) AS totalUsers,
            COALESCE(SUM(status = 'active'), 0) AS activeUsers,
            COALESCE(SUM(status = 'inactive'), 0) AS inactiveUsers,
            COALESCE(SUM(role = 'admin'), 0) AS administrators
        FROM users
        WHERE store_id = ?
        `,
        [storeId]
    );

    return stats;
};

module.exports = {
    findUserByEmail,
    findUserByUsername,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    updatePassword,
    updateStatus,
    deleteUser,
    searchUsers,
    getUserStatistics
};
