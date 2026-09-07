import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

const data = [

    { month: "Jan", sales: 35 },
    { month: "Feb", sales: 52 },
    { month: "Mar", sales: 44 },
    { month: "Apr", sales: 70 },
    { month: "May", sales: 88 },
    { month: "Jun", sales: 102 }

];

function SalesChart() {

    return (

        <div className="chart-card">

            <h3>Monthly Sales</h3>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart data={data}>

                    <XAxis dataKey="month" />

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