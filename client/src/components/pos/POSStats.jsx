import { useEffect, useState } from "react";

import {
    FiShoppingCart,
    FiDollarSign,
    FiPackage
} from "react-icons/fi";

import { getSaleStatistics } from "../../api/saleApi";

function POSStats({ refreshKey }) {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalAmount: 0,
        totalItems: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);

                const response =
                    await getSaleStatistics();

                const data = response.data || {};

                setStats({
                    totalSales: Number(
                        data.totalSales || 0
                    ),

                    totalAmount: Number(
                        data.totalAmount || 0
                    ),

                    totalItems: Number(
                        data.totalItems || 0
                    )
                });

            } catch (error) {
                console.error(
                    "Failed to load POS statistics:",
                    error
                );

                setStats({
                    totalSales: 0,
                    totalAmount: 0,
                    totalItems: 0
                });

            } finally {
                setLoading(false);
            }
        };

        loadStats();

    }, [refreshKey]);

    const displayStats = [
        {
            title: "Total Sales",
            value: loading
                ? "..."
                : `KSh ${stats.totalAmount.toLocaleString()}`,
            icon: <FiDollarSign />
        },

        {
            title: "Transactions",
            value: loading
                ? "..."
                : stats.totalSales.toLocaleString(),
            icon: <FiShoppingCart />
        },

        {
            title: "Items Sold",
            value: loading
                ? "..."
                : stats.totalItems.toLocaleString(),
            icon: <FiPackage />
        }
    ];

    return (
        <div className="pos-stats">

            {displayStats.map((stat) => (
                <div
                    className="pos-stat"
                    key={stat.title}
                >
                    <div className="stat-icon">
                        {stat.icon}
                    </div>

                    <div>
                        <strong>
                            {stat.value}
                        </strong>

                        <span>
                            {stat.title}
                        </span>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default POSStats;