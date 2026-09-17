import { useEffect, useState } from "react";

import {
    FiShoppingBag,
    FiDollarSign,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";

import { getPurchaseStatistics } from "../../api/purchaseApi";

function PurchaseStats() {

    const [stats, setStats] = useState({
        totalPurchases: 0,
        totalAmount: 0,
        completedPurchases: 0,
        cancelledPurchases: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadStats = async () => {

            try {

                const response =
                    await getPurchaseStatistics();

                setStats(response?.data || {});

            } catch (error) {

                console.error(
                    "Failed to load purchase statistics:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadStats();

    }, []);

    const statCards = [
        {
            title: "Total Purchases",
            value: stats.totalPurchases ?? 0,
            icon: <FiShoppingBag />
        },
        {
            title: "Total Amount",
            value: `KSh ${Number(
                stats.totalAmount || 0
            ).toLocaleString()}`,
            icon: <FiDollarSign />
        },
        {
            title: "Completed Purchases",
            value: stats.completedPurchases ?? 0,
            icon: <FiCheckCircle />
        },
        {
            title: "Cancelled Purchases",
            value: stats.cancelledPurchases ?? 0,
            icon: <FiXCircle />
        }
    ];

    return (
        <div className="stats-grid">

            {statCards.map((stat) => (

                <div
                    className="stat-card"
                    key={stat.title}
                >

                    <div className="stat-icon">
                        {stat.icon}
                    </div>

                    <h2>
                        {loading ? "..." : stat.value}
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
