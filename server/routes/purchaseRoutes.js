const express = require("express");

const router = express.Router();

const purchaseController =
    require("../controllers/purchaseController");

const authenticate =
    require("../middleware/authMiddleware");

const authorize =
    require("../middleware/roleMiddleware");

const {
    createPurchaseValidation,
    validate
} = require("../validators/purchaseValidation");


router.use(authenticate);


// ============================================================
// Get all purchases
// ============================================================

router.get(
    "/",
    authorize(
        "admin",
        "manager",
        "cashier"
    ),
    purchaseController.getPurchases
);


// ============================================================
// Search purchases
// ============================================================

router.get(
    "/search",
    authorize(
        "admin",
        "manager",
        "cashier"
    ),
    purchaseController.searchPurchases
);


// ============================================================
// Paginated purchases
// ============================================================

router.get(
    "/page/list",
    authorize(
        "admin",
        "manager",
        "cashier"
    ),
    purchaseController.getPurchasesPaginated
);


// ============================================================
// Purchase statistics
// ============================================================

router.get(
    "/stats",
    authorize(
        "admin",
        "manager"
    ),
    purchaseController.getPurchaseStatistics
);


// ============================================================
// Get single purchase
// ============================================================

router.get(
    "/:id",
    authorize(
        "admin",
        "manager",
        "cashier"
    ),
    purchaseController.getPurchase
);


// ============================================================
// Create purchase
// ============================================================

router.post(
    "/",
    authorize(
        "admin",
        "manager"
    ),
    createPurchaseValidation,
    validate,
    purchaseController.createPurchase
);


// ============================================================
// Cancel purchase
// ============================================================

router.patch(
    "/:id/cancel",
    authorize(
        "admin",
        "manager"
    ),
    purchaseController.cancelPurchase
);


module.exports = router;
