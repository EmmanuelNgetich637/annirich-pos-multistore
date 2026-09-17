const { body, param, validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};

const createUserValidation = [
    body("full_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters."),

    body("username")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email."),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),

    body("role")
        .isIn(["admin", "manager", "cashier"])
        .withMessage("Invalid role.")
];

const updateUserValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid user ID."),

    body("full_name")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters."),

    body("username")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email."),

    body("password")
        .optional({ values: "falsy" })
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),

    body("role")
        .isIn(["admin", "manager", "cashier"])
        .withMessage("Invalid role.")
];

const statusValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid user ID."),

    body("status")
        .isIn(["active", "inactive"])
        .withMessage("Invalid status.")
];

module.exports = {
    createUserValidation,
    updateUserValidation,
    statusValidation,
    validate
};
