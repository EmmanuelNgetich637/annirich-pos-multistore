import {
    FiDollarSign,
    FiShoppingBag,
    FiTrendingUp,
    FiClock
} from "react-icons/fi";

function SalesStats({ sales = [] }) {

    const completedSales =
        sales.filter(
            (sale) =>
                sale.status === "Completed"
        );

    const totalSales =
        completedSales.reduce(
            (sum, sale) =>
                sum + Number(sale.total || 0),
            0
        );

    const totalItems =
        completedSales.reduce(
            (sum, sale) =>
                sum + Number(sale.items || 0),
            0
        );

    const pendingSales =
        sales.filter(
            (sale) =>
                sale.status === "Pending"
        ).length;

    const stats = [
        {
            title: "Completed Sales",
            value: `KSh ${totalSales.toLocaleString()}`,
            icon: <FiDollarSign />
        },
        {
            title: "Transactions",
            value: completedSales.length,
            icon: <FiShoppingBag />
        },
        {
            title: "Items Sold",
            value: totalItems,
            icon: <FiTrendingUp />
        },
        {
            title: "Pending",
            value: pendingSales,
            icon: <FiClock />
        }
    ];

    return (
        <div className="sales-stats">

            {stats.map((stat) => (
                <div
                    className="sales-stat-card"
                    key={stat.title}
                >
                    <div className="sales-stat-icon">
                        {stat.icon}
                    </div>

                    <div>
                        <span>
                            {stat.title}
                        </span>

                        <strong>
                            {stat.value}
                        </strong>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default SalesStats;
