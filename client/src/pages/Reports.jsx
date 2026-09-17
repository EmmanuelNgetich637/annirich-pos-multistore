import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";

import ReportStats from "../components/reports/ReportStats";
import ReportToolbar from "../components/reports/ReportToolbar";
import SalesTrend from "../components/reports/SalesTrend";
import SalesByCategory from "../components/reports/SalesByCategory";
import TopProducts from "../components/reports/TopProducts";

import {
    getReportSummary,
    getSalesTrend,
    getSalesByCategory,
    getTopProducts
} from "../api/reportApi";

function Reports() {
    const [startDate, setStartDate] = useState("2026-07-01");
    const [endDate, setEndDate] = useState("2026-09-30");

    const [summary, setSummary] = useState(null);
    const [salesTrend, setSalesTrend] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                summaryResponse,
                trendResponse,
                categoryResponse,
                productsResponse
            ] = await Promise.all([
                getReportSummary(startDate, endDate),
                getSalesTrend(startDate, endDate),
                getSalesByCategory(startDate, endDate),
                getTopProducts(startDate, endDate)
            ]);

            setSummary(summaryResponse.data);
            setSalesTrend(trendResponse.data || []);
            setSalesByCategory(categoryResponse.data || []);
            setTopProducts(productsResponse.data || []);
        } catch (err) {
            console.error("Failed to load reports:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load reports."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, [startDate, endDate]);

    return (
        <div className="reports-page">
            <PageHeader
                title="Reports"
                subtitle="Analyze your sales and business performance."
            />

            <ReportToolbar
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />

            {loading && (
                <div className="reports-loading">
                    Loading reports...
                </div>
            )}

            {error && !loading && (
                <div className="reports-error">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    <ReportStats
                        stats={summary}
                    />

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
                </>
            )}
        </div>
    );
}

export default Reports;
