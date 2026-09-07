import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

function SalesTrend({ data }) {

    return (
        <div className="report-chart-card">

            <div className="report-chart-header">

                <div>
                    <h3>Sales Trend</h3>
                    <span>
                        Sales performance for the selected period
                    </span>
                </div>

                <select defaultValue="week">
                    <option value="week">
                        This Week
                    </option>

                    <option value="month">
                        This Month
                    </option>

                    <option value="year">
                        This Year
                    </option>
                </select>

            </div>

            <div className="report-chart">

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >
                    <AreaChart data={data}>

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="day"
                        />

                        <YAxis />

                        <Tooltip
                            formatter={(value) =>
                                `KES ${value.toLocaleString()}`
                            }
                        />

                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#2563EB"
                            fill="#DBEAFE"
                            strokeWidth={2}
                        />

                    </AreaChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default SalesTrend;