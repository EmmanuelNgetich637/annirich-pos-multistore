const ReportService =
    require("../services/reportService");


/*
|--------------------------------------------------------------------------
| Sales Report
|--------------------------------------------------------------------------
*/

const getSalesReport = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data =
            await ReportService.getSalesReport(
                startDate,
                endDate,
                req.storeId
            );

        return res.status(200).json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| Purchase Report
|--------------------------------------------------------------------------
*/

const getPurchaseReport = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data =
            await ReportService.getPurchaseReport(
                startDate,
                endDate,
                req.storeId
            );

        return res.status(200).json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| Expense Report
|--------------------------------------------------------------------------
*/

const getExpenseReport = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data =
            await ReportService.getExpenseReport(
                startDate,
                endDate,
                req.storeId
            );

        return res.status(200).json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| Inventory Report
|--------------------------------------------------------------------------
*/

const getInventoryReport = async (req, res) => {

    try {

        const data =
            await ReportService.getInventoryReport(
                req.storeId
            );

        return res.status(200).json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| Profit Report
|--------------------------------------------------------------------------
*/

const getProfitReport = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data =
            await ReportService.getProfitReport(
                startDate,
                endDate,
                req.storeId
            );

        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
|--------------------------------------------------------------------------
| Report Summary
|--------------------------------------------------------------------------
*/

const getReportSummary = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data = await ReportService.getReportSummary(
            startDate,
            endDate,
            req.storeId
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Sales Trend
|--------------------------------------------------------------------------
*/

const getSalesTrend = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data = await ReportService.getSalesTrend(
            startDate,
            endDate,
            req.storeId
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Sales By Category
|--------------------------------------------------------------------------
*/

const getSalesByCategory = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data = await ReportService.getSalesByCategory(
            startDate,
            endDate,
            req.storeId
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


/*
|--------------------------------------------------------------------------
| Top Products
|--------------------------------------------------------------------------
*/

const getTopProducts = async (req, res) => {

    try {

        const {
            startDate,
            endDate
        } = req.query;

        const data = await ReportService.getTopProducts(
            startDate,
            endDate,
            req.storeId
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {

    getSalesReport,

    getPurchaseReport,

    getExpenseReport,

    getInventoryReport,

    getProfitReport,
    getReportSummary,
    getSalesTrend,
    getSalesByCategory,
    getTopProducts

};