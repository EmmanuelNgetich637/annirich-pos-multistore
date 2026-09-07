import {
    FiTruck,
    FiCheckCircle,
    FiDollarSign,
    FiXCircle
} from "react-icons/fi";

function SupplierStats() {

    const stats = [
        {
            title: "Total Suppliers",
            value: 4,
            icon: <FiTruck />
        },
        {
            title: "Active Suppliers",
            value: 3,
            icon: <FiCheckCircle />
        },
        {
            title: "Outstanding Balance",
            value: "KSh 57,500",
            icon: <FiDollarSign />
        },
        {
            title: "Inactive Suppliers",
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

export default SupplierStats;