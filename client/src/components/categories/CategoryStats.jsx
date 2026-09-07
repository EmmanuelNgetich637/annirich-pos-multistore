import {
    FiLayers,
    FiCheckCircle,
    FiPackage,
    FiXCircle
} from "react-icons/fi";

function CategoryStats() {

    const stats = [
        {
            title: "Total Categories",
            value: 4,
            icon: <FiLayers />
        },
        {
            title: "Active Categories",
            value: 3,
            icon: <FiCheckCircle />
        },
        {
            title: "Products Assigned",
            value: 63,
            icon: <FiPackage />
        },
        {
            title: "Inactive Categories",
            value: 1,
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