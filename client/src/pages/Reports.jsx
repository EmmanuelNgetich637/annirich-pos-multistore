import PageHeader from "../components/common/PageHeader";

import ReportStats from "../components/reports/ReportStats";
import ReportToolbar from "../components/reports/ReportToolbar";
import SalesTrend from "../components/reports/SalesTrend";
import SalesByCategory from "../components/reports/SalesByCategory";
import TopProducts from "../components/reports/TopProducts";

import {
    reportStats,
    salesTrend,
    salesByCategory,
    topProducts
} from "../data/reports";

function Reports() {

    return (
        <div className="reports-page">

            <PageHeader
                title="Reports"
                subtitle="Analyze your sales and business performance."
            />

            <ReportStats
                stats={reportStats}
            />

            <ReportToolbar />

            <div className="reports-main-chart">
                <SalesTrend
                    data={salesTrend}
                />
            </div>

            <div className="reports-grid">

                <SalesByCategory
                    data={salesByCategory}
                />

                <TopProducts
                    products={topProducts}
                />

            </div>

        </div>
    );
}

export default Reports;