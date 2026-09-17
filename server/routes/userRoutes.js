const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const userController = require("../controllers/userController");

const {
    createUserValidation,
    updateUserValidation,
    statusValidation,
    validate
} = require("../validators/userValidator");

router.use(authenticate);

// Current profile
router.get(
    "/profile",
    (req, res) => {
        res.json({
            success: true,
            user: req.user
        });
    }
);

// User management
router.get(
    "/",
    authorize("admin", "manager"),
    userController.getUsers
);

router.get(
    "/search",
    authorize("admin", "manager"),
    userController.searchUsers
);

router.get(
    "/stats",
    authorize("admin"),
    userController.getStatistics
);

router.post(
    "/",
    authorize("admin"),
    createUserValidation,
    validate,
    userController.createUser
);

router.put(
    "/:id",
    authorize("admin"),
    updateUserValidation,
    validate,
    userController.updateUser
);

router.patch(
    "/:id/status",
    authorize("admin"),
    statusValidation,
    validate,
    userController.changeStatus
);

router.delete(
    "/:id",
    authorize("admin"),
    userController.deleteUser
);

// Existing role test endpoints
router.get(
    "/admin",
    authorize("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

router.get(
    "/manager",
    authorize("admin", "manager"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Manager"
        });
    }
);

router.get(
    "/cashier",
    authorize("admin", "manager", "cashier"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Cashier"
        });
    }
);

router.get(
    "/:id",
    authorize("admin", "manager"),
    userController.getUser
);

module.exports = router;
