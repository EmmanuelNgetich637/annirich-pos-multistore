import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-KE", {
        day: "2-digit",
        month: "short"
    });
}

function SalesTrend({ data = [] }) {
    const chartData = data.map((item) => ({
        date: formatDate(item.date),
        sales: Number(item.sales || 0),
        orders: Number(item.orders || 0)
    }));

    return (
        <div className="sales-trend">
            <div className="report-section-header">
                <div>
                    <h3>Sales Trend</h3>
                    <p>Revenue generated during the selected period.</p>
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="report-empty">
                    No sales data for this period.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="date" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) => [
                                `KSh ${Number(value).toLocaleString()}`,
                                "Sales"
                            ]}
                        />

                        <Area
                            type="monotone"
                            dataKey="sales"
                            fill="currentColor"
                            stroke="currentColor"
                            fillOpacity={0.15}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default SalesTrend;
