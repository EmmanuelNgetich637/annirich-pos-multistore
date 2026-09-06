const { body, validationResult } = require("express-validator");

// ==========================
// Register Validation
// ==========================
const registerValidation = [
  body("storeCode")
    .trim()
    .notEmpty()
    .withMessage("Store code is required"),

  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "manager", "cashier"])
    .withMessage("Invalid role"),
];

// ==========================
// Login Validation
// ==========================
const loginValidation = [
  body("storeCode")
    .trim()
    .notEmpty()
    .withMessage("Store code is required"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ==========================
// Validation Middleware
// ==========================
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  validate,
};
