import {
    FiShoppingBag,
    FiDollarSign,
    FiCheckCircle,
    FiClock
} from "react-icons/fi";

function PurchaseStats() {

    const stats = [
        {
            title: "Total Purchases",
            value: "KSh 384,000",
            icon: <FiShoppingBag />
        },
        {
            title: "Amount Paid",
            value: "KSh 247,000",
            icon: <FiCheckCircle />
        },
        {
            title: "Outstanding",
            value: "KSh 137,000",
            icon: <FiDollarSign />
        },
        {
            title: "Pending Purchases",
            value: 1,
            icon: <FiClock />
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

export default PurchaseStats;