const Dashboard = require("../models/dashboardModel");


/*
|--------------------------------------------------------------------------
| Get Dashboard
|--------------------------------------------------------------------------
*/

const getDashboard = async (storeId) => {

    const summary =
        await Dashboard.getDashboardSummary(storeId);

    const recentSales =
        await Dashboard.getRecentSales(storeId);

    const recentPurchases =
        await Dashboard.getRecentPurchases(storeId);

    const lowStockProducts =
        await Dashboard.getLowStockProducts(storeId);

    const monthlySales =
        await Dashboard.getMonthlySales(storeId);

    return {

        summary,

        recentSales,

        recentPurchases,

        lowStockProducts,

        monthlySales

    };

};


module.exports = {

    getDashboard

};