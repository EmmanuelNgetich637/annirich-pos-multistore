import {
    FiDollarSign,
    FiShoppingBag,
    FiTrendingUp,
    FiCreditCard
} from "react-icons/fi";

function ReportStats({ stats }) {

    const cards = [
        {
            title: "Total Sales",
            value: `KES ${stats.totalSales.toLocaleString()}`,
            icon: <FiDollarSign />
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: <FiShoppingBag />
        },
        {
            title: "Gross Profit",
            value: `KES ${stats.grossProfit.toLocaleString()}`,
            icon: <FiTrendingUp />
        },
        {
            title: "Average Order",
            value: `KES ${stats.averageOrder.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`,
            icon: <FiCreditCard />
        }
    ];

    return (
        <div className="report-stats">

            {cards.map(card => (
                <div
                    className="report-stat-card"
                    key={card.title}
                >
                    <div className="report-stat-icon">
                        {card.icon}
                    </div>

                    <div className="report-stat-content">
                        <span>{card.title}</span>
                        <strong>{card.value}</strong>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default ReportStats;