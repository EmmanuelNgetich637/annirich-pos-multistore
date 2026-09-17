import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Cell
} from "recharts";

function SalesByCategory({ data = [] }) {
    return (
        <div className="sales-by-category">
            <div className="report-section-header">
                <div>
                    <h3>Sales by Category</h3>
                    <p>Revenue by product category.</p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="report-empty">
                    No category sales for this period.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="revenue"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value) => [
                                `KSh ${Number(value).toLocaleString()}`,
                                "Revenue"
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default SalesByCategory;
