import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

function SalesChart({ data = [] }) {

    const chartData = data.map((item) => ({
        month: item.month,
        sales: Number(item.totalSales || 0)
    }));

    return (

        <div className="chart-card">

            <h3>Monthly Sales</h3>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart data={chartData}>

                    <XAxis
                        dataKey="month"
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="sales"
                        fill="#16A34A"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default SalesChart;
