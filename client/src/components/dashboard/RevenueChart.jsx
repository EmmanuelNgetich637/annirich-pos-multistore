import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const data = [

    { month: "Jan", revenue: 180000 },
    { month: "Feb", revenue: 220000 },
    { month: "Mar", revenue: 195000 },
    { month: "Apr", revenue: 265000 },
    { month: "May", revenue: 300000 },
    { month: "Jun", revenue: 345000 }

];

function RevenueChart() {

    return (

        <div className="chart-card">

            <h3>Revenue Overview</h3>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <AreaChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Area
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