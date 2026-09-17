const express = require("express");

const router = express.Router();

const purchaseController = require("../controllers/purchaseController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createPurchaseValidation,
    validate
} = require("../validators/purchaseValidation");

router.use(authenticate);

// List purchases
router.get(
    "/",
    authorize("admin", "manager", "cashier"),
    purchaseController.getPurchases
);

// Search purchases
router.get(
    "/search",
    authorize("admin", "manager", "cashier"),
    purchaseController.searchPurchases
);

// Pagination
router.get(
    "/page/list",
    authorize("admin", "manager", "cashier"),
    purchaseController.getPurchasesPaginated
);

// Statistics
router.get(
    "/stats",
    authorize("admin", "manager"),
    purchaseController.getPurchaseStatistics
);

// Get purchase by ID
router.get(
    "/:id",
    authorize("admin", "manager", "cashier"),
    purchaseController.getPurchase
);

// Create purchase
router.post(
    "/",
    authorize("admin", "manager"),
    createPurchaseValidation,
    validate,
    purchaseController.createPurchase
);

module.exports = router;
