import { useEffect, useState } from "react";

import {
    FiTruck,
    FiCheckCircle,
    FiDollarSign,
    FiXCircle
} from "react-icons/fi";

import { getSupplierStatistics } from "../../api/supplierApi";

function SupplierStats() {

    const [stats, setStats] = useState({
        totalSuppliers: 0,
        activeSuppliers: 0,
        inactiveSuppliers: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadStats = async () => {

            try {

                const response =
                    await getSupplierStatistics();

                setStats(response?.data || {});

            } catch (error) {

                console.error(
                    "Failed to load supplier statistics:",
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
            title: "Total Suppliers",
            value: stats.totalSuppliers ?? 0,
            icon: <FiTruck />
        },

        {
            title: "Active Suppliers",
            value: stats.activeSuppliers ?? 0,
            icon: <FiCheckCircle />
        },

        {
            title: "Outstanding Balance",
            value: "KSh 0",
            icon: <FiDollarSign />
        },

        {
            title: "Inactive Suppliers",
            value: stats.inactiveSuppliers ?? 0,
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

export default SupplierStats;
