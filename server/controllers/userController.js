const userService = require("../services/userService");

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers(req.storeId);

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await userService.getUser(
            req.params.id,
            req.storeId
        );

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        const status = error.message === "User not found." ? 404 : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(
            req.body,
            req.storeId
        );

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(
            req.params.id,
            req.body,
            req.storeId
        );

        res.json({
            success: true,
            message: "User updated successfully.",
            data: user
        });
    } catch (error) {
        const status = error.message === "User not found." ? 404 : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const changeStatus = async (req, res) => {
    try {
        const user = await userService.changeStatus(
            req.params.id,
            req.body.status,
            req.storeId,
            req.user.id
        );

        res.json({
            success: true,
            message: "User status updated successfully.",
            data: user
        });
    } catch (error) {
        const status = error.message === "User not found." ? 404 : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(
            req.params.id,
            req.storeId,
            req.user.id
        );

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        const status = error.message === "User not found." ? 404 : 400;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

const searchUsers = async (req, res) => {
    try {
        const users = await userService.searchUsers(
            req.query.q || "",
            req.storeId
        );

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getStatistics = async (req, res) => {
    try {
        const stats = await userService.getStatistics(
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
    getUsers,
    getUser,
    createUser,
    updateUser,
    changeStatus,
    deleteUser,
    searchUsers,
    getStatistics
};
