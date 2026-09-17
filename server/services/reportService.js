const Report = require("../models/reportModel");

const getSalesReport = async (startDate, endDate, storeId) => {
    return Report.getSalesReport(startDate, endDate, storeId);
};

const getPurchaseReport = async (startDate, endDate, storeId) => {
    return Report.getPurchaseReport(startDate, endDate, storeId);
};

const getExpenseReport = async (startDate, endDate, storeId) => {
    return Report.getExpenseReport(startDate, endDate, storeId);
};

const getInventoryReport = async (storeId) => {
    return Report.getInventoryReport(storeId);
};

const getReportSummary = async (startDate, endDate, storeId) => {
    return Report.getReportSummary(startDate, endDate, storeId);
};

const getSalesTrend = async (startDate, endDate, storeId) => {
    return Report.getSalesTrend(startDate, endDate, storeId);
};

const getSalesByCategory = async (startDate, endDate, storeId) => {
    return Report.getSalesByCategory(startDate, endDate, storeId);
};

const getTopProducts = async (startDate, endDate, storeId) => {
    return Report.getTopProducts(startDate, endDate, storeId);
};

const getProfitReport = async (startDate, endDate, storeId) => {
    return Report.getProfitReport(startDate, endDate, storeId);
};

module.exports = {
    getSalesReport,
    getPurchaseReport,
    getExpenseReport,
    getInventoryReport,
    getReportSummary,
    getSalesTrend,
    getSalesByCategory,
    getTopProducts,
    getProfitReport
};
