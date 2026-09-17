import {
    FiLayers,
    FiCheckCircle,
    FiPackage,
    FiXCircle
} from "react-icons/fi";

function CategoryStats({
    categories = []
}) {

    const totalCategories =
        categories.length;

    const activeCategories =
        categories.filter(
            (category) =>
                String(category.status || "")
                    .toLowerCase() === "active"
        ).length;

    const inactiveCategories =
        categories.filter(
            (category) =>
                String(category.status || "")
                    .toLowerCase() === "inactive"
        ).length;

    const productsAssigned =
        categories.reduce(
            (total, category) =>
                total +
                Number(
                    category.product_count || 0
                ),
            0
        );

    const stats = [
        {
            title: "Total Categories",
            value: totalCategories,
            icon: <FiLayers />
        },
        {
            title: "Active Categories",
            value: activeCategories,
            icon: <FiCheckCircle />
        },
        {
            title: "Products Assigned",
            value: productsAssigned,
            icon: <FiPackage />
        },
        {
            title: "Inactive Categories",
            value: inactiveCategories,
            icon: <FiXCircle />
        }
    ];

    return (
        <div className="stats-grid">

            {stats.map((stat) => (
                <div
                    className="stat-card"
                    key={stat.title}
                >
                    <div className="stat-icon">
                        {stat.icon}
                    </div>

                    <h2>
                        {stat.value}
                    </h2>

                    <p>
                        {stat.title}
                    </p>
                </div>
            ))}

        </div>
    );
}

export default CategoryStats;