const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authenticate = require("../middleware/authMiddleware");

const {
    registerValidation,
    loginValidation,
    validate
} = require("../validators/authValidator");

// Register
router.post(
    "/register",
    registerValidation,
    validate,
    authController.register
);

// Login
router.post(
    "/login",
    loginValidation,
    validate,
    authController.login
);

// Current authenticated user
router.get(
    "/me",
    authenticate,
    authController.me
);

module.exports = router;