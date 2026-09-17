function formatCurrency(value) {
    return `KSh ${Number(value || 0).toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function ReportStats({ stats }) {
    if (!stats) {
        return null;
    }

    const cards = [
        {
            label: "Total Sales",
            value: formatCurrency(stats.totalSales)
        },
        {
            label: "Total Orders",
            value: Number(stats.totalOrders || 0).toLocaleString()
        },
        {
            label: "Estimated Gross Profit",
            value: formatCurrency(stats.grossProfit)
        },
        {
            label: "Average Order",
            value: formatCurrency(stats.averageOrder)
        }
    ];

    return (
        <div className="report-stats">
            {cards.map((card) => (
                <div
                    className="report-stat-card"
                    key={card.label}
                >
                    <span className="report-stat-label">
                        {card.label}
                    </span>

                    <strong className="report-stat-value">
                        {card.value}
                    </strong>
                </div>
            ))}
        </div>
    );
}

export default ReportStats;
