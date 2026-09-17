import { useEffect, useState } from "react";

import {
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiDollarSign
} from "react-icons/fi";

import { getCustomerStatistics } from "../../api/customerApi";


function CustomerStats() {

    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0
    });

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadStats = async () => {

            try {

                const response =
                    await getCustomerStatistics();

                setStats(
                    response?.data || {}
                );

            } catch (error) {

                console.error(
                    "Failed to load customer statistics:",
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
            title: "Total Customers",
            value: stats.totalCustomers ?? 0,
            icon: <FiUsers />
        },
        {
            title: "Active Customers",
            value: stats.activeCustomers ?? 0,
            icon: <FiUserCheck />
        },
        {
            title: "Inactive Customers",
            value: stats.inactiveCustomers ?? 0,
            icon: <FiUserX />
        },
        {
            title: "Outstanding Balance",
            value: "KSh 0",
            icon: <FiDollarSign />
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
                        {loading
                            ? "..."
                            : stat.value}
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
