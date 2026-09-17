const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const VALID_ROLES = ["admin", "manager", "cashier"];
const VALID_STATUSES = ["active", "inactive"];

const sanitizeUser = (user) => {
    if (!user) {
        return user;
    }

    return {
        id: user.id,
        store_id: user.store_id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        created_at: user.created_at
    };
};

const validateRole = (role) => {
    if (!VALID_ROLES.includes(role)) {
        throw new Error("Invalid role.");
    }
};

const getUsers = async (storeId) => {
    const users = await User.getAllUsers(storeId);
    return users.map(sanitizeUser);
};

const getUser = async (id, storeId) => {
    const user = await User.getUserById(id, storeId);

    if (!user) {
        throw new Error("User not found.");
    }

    return sanitizeUser(user);
};

const createUser = async (data, storeId) => {
    const {
        full_name,
        username,
        email,
        password,
        role = "cashier"
    } = data;

    if (!full_name || !full_name.trim()) {
        throw new Error("Full name is required.");
    }

    if (!username || !username.trim()) {
        throw new Error("Username is required.");
    }

    if (!email || !email.trim()) {
        throw new Error("Email is required.");
    }

    if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
    }

    validateRole(role);

    const existingUsername = await User.findUserByUsername(
        username.trim(),
        storeId
    );

    if (existingUsername) {
        throw new Error("Username already exists in this store.");
    }

    const existingEmail = await User.findUserByEmail(
        email.trim(),
        storeId
    );

    if (existingEmail) {
        throw new Error("Email already exists in this store.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.createUser({
        full_name: full_name.trim(),
        username: username.trim(),
        email: email.trim(),
        password: hashedPassword,
        role,
        store_id: storeId
    });

    return getUser(userId, storeId);
};

const updateUser = async (id, data, storeId) => {
    const existingUser = await User.getUserById(id, storeId);

    if (!existingUser) {
        throw new Error("User not found.");
    }

    const {
        full_name,
        username,
        email,
        role,
        password
    } = data;

    if (!full_name || !full_name.trim()) {
        throw new Error("Full name is required.");
    }

    if (!username || !username.trim()) {
        throw new Error("Username is required.");
    }

    if (!email || !email.trim()) {
        throw new Error("Email is required.");
    }

    validateRole(role);

    const usernameOwner = await User.findUserByUsername(
        username.trim(),
        storeId
    );

    if (
        usernameOwner &&
        Number(usernameOwner.id) !== Number(id)
    ) {
        throw new Error("Username already exists in this store.");
    }

    const emailOwner = await User.findUserByEmail(
        email.trim(),
        storeId
    );

    if (
        emailOwner &&
        Number(emailOwner.id) !== Number(id)
    ) {
        throw new Error("Email already exists in this store.");
    }

    await User.updateUser(
        id,
        storeId,
        {
            full_name: full_name.trim(),
            username: username.trim(),
            email: email.trim(),
            role
        }
    );

    if (password !== undefined && password !== "") {
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.updatePassword(
            id,
            storeId,
            hashedPassword
        );
    }

    return getUser(id, storeId);
};

const changeStatus = async (id, status, storeId, requestingUserId) => {
    const user = await User.getUserById(id, storeId);

    if (!user) {
        throw new Error("User not found.");
    }

    if (!VALID_STATUSES.includes(status)) {
        throw new Error("Invalid status.");
    }

    if (
        Number(id) === Number(requestingUserId) &&
        status === "inactive"
    ) {
        throw new Error("You cannot deactivate your own account.");
    }

    await User.updateStatus(id, storeId, status);

    return getUser(id, storeId);
};

const deleteUser = async (id, storeId, requestingUserId) => {
    const user = await User.getUserById(id, storeId);

    if (!user) {
        throw new Error("User not found.");
    }

    if (Number(id) === Number(requestingUserId)) {
        throw new Error("You cannot deactivate your own account.");
    }

    await User.deleteUser(id, storeId);

    return {
        message: "User deactivated successfully."
    };
};

const searchUsers = async (keyword, storeId) => {
    if (!keyword || !keyword.trim()) {
        return getUsers(storeId);
    }

    const users = await User.searchUsers(
        keyword,
        storeId
    );

    return users.map(sanitizeUser);
};

const getStatistics = async (storeId) => {
    return User.getUserStatistics(storeId);
};

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    changeStatus,
    deleteUser,
    searchUsers,
    getStatistics
};
