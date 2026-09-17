const express = require("express");

const router = express.Router();

const reportController =
    require("../controllers/reportController");

const authenticate =
    require("../middleware/authMiddleware");

const authorize =
    require("../middleware/roleMiddleware");


/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

router.get(
    "/sales",
    authenticate,
    authorize("admin", "manager"),
    reportController.getSalesReport
);


/*
|--------------------------------------------------------------------------
| Purchase Report
|--------------------------------------------------------------------------
*/

router.get(
    "/purchases",
    authenticate,
    authorize("admin", "manager"),
    reportController.getPurchaseReport
);


/*
|--------------------------------------------------------------------------
| Expense Report
|--------------------------------------------------------------------------
*/

router.get(
    "/expenses",
    authenticate,
    authorize("admin", "manager"),
    reportController.getExpenseReport
);


/*
|--------------------------------------------------------------------------
| Inventory Report
|--------------------------------------------------------------------------
*/

router.get(
    "/inventory",
    authenticate,
    authorize("admin", "manager"),
    reportController.getInventoryReport
);


/*
|--------------------------------------------------------------------------
| Profit Report
|--------------------------------------------------------------------------
*/

router.get(
    "/profit",
    authenticate,
    authorize("admin", "manager"),
    reportController.getProfitReport
);


/*
|--------------------------------------------------------------------------
| Report Analytics
|--------------------------------------------------------------------------
*/

router.get(
    "/summary",
    authenticate,
    authorize("admin", "manager"),
    reportController.getReportSummary
);

router.get(
    "/trend",
    authenticate,
    authorize("admin", "manager"),
    reportController.getSalesTrend
);

router.get(
    "/categories",
    authenticate,
    authorize("admin", "manager"),
    reportController.getSalesByCategory
);

router.get(
    "/top-products",
    authenticate,
    authorize("admin", "manager"),
    reportController.getTopProducts
);


module.exports = router;