import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

function SalesByCategory({ data }) {

    const colors = [
        "#2563EB",
        "#16A34A",
        "#F59E0B",
        "#7C3AED",
        "#64748B"
    ];

    return (
        <div className="report-chart-card">

            <div className="report-chart-header">

                <div>
                    <h3>Sales by Category</h3>

                    <span>
                        Revenue distribution
                    </span>
                </div>

            </div>

            <div className="report-pie-chart">

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >
                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={95}
                            innerRadius={55}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={entry.name}
                                    fill={
                                        colors[
                                            index %
                                            colors.length
                                        ]
                                    }
                                />
                            ))}
                        </Pie>

                        <Tooltip />

                        <Legend
                            verticalAlign="bottom"
                        />

                    </PieChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default SalesByCategory;