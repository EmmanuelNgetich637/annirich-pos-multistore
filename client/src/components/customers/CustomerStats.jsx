import {
    FiUsers,
    FiUserCheck,
    FiShoppingBag,
    FiDollarSign
} from "react-icons/fi";

function CustomerStats() {

    const stats = [
        {
            title: "Total Customers",
            value: 4,
            icon: <FiUsers />
        },
        {
            title: "Active Customers",
            value: 3,
            icon: <FiUserCheck />
        },
        {
            title: "Total Purchases",
            value: 44,
            icon: <FiShoppingBag />
        },
        {
            title: "Outstanding Balance",
            value: "KSh 17,500",
            icon: <FiDollarSign />
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

export default CustomerStats;