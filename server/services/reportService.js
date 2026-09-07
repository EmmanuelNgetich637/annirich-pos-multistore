const Report = require("../models/reportModel");


/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

const getSalesReport = async (
    startDate,
    endDate,
    storeId
) => {

    return await Report.getSalesReport(
        startDate,
        endDate,
        storeId
    );

};


/*
|--------------------------------------------------------------------------
| Purchase Report
|--------------------------------------------------------------------------
*/

const getPurchaseReport = async (
    startDate,
    endDate,
    storeId
) => {

    return await Report.getPurchaseReport(
        startDate,
        endDate,
        storeId
    );

};


/*
|--------------------------------------------------------------------------
| Expense Report
|--------------------------------------------------------------------------
*/

const getExpenseReport = async (
    startDate,
    endDate,
    storeId
) => {

    return await Report.getExpenseReport(
        startDate,
        endDate,
        storeId
    );

};


/*
|--------------------------------------------------------------------------
| Inventory Report
|--------------------------------------------------------------------------
*/

const getInventoryReport = async (storeId) => {

    return await Report.getInventoryReport(
        storeId
    );

};


/*
|--------------------------------------------------------------------------
| Profit Report
|--------------------------------------------------------------------------
*/

const getProfitReport = async (
    startDate,
    endDate,
    storeId
) => {

    const result =
        await Report.getProfitReport(
            startDate,
            endDate,
            storeId
        );

    return {

        totalSales:
            result.revenue,

        totalPurchases:
            result.purchases,

        totalExpenses:
            result.expenses,

        grossProfit:
            result.profit

    };

};


module.exports = {
    getSalesReport,
    getPurchaseReport,
    getExpenseReport,
    getInventoryReport,
    getProfitReport
};