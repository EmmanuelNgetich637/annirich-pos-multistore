import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

function RevenueChart({ data = [] }) {

    const chartData = data.map((item) => ({
        month: item.month,
        revenue: Number(item.revenue || 0)
    }));

    return (

        <div className="chart-card">

            <h3>Revenue Overview</h3>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <AreaChart data={chartData}>

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="month"
                    />

                    <YAxis />

                    <Tooltip
                        formatter={(value) =>
                            `KES ${Number(value).toLocaleString()}`
                        }
                    />

                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563EB"
                        fill="#93C5FD"
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>

    );

}

export default RevenueChart;
