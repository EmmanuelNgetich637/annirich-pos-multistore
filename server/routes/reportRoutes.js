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


module.exports = router;