import { useEffect, useState } from "react";

import {
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiShield
} from "react-icons/fi";

import { getUserStatistics } from "../../api/userApi";

function UserStats() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        administrators: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadStats = async () => {

            try {

                const response = await getUserStatistics();

                setStats(response?.data || {});

            } catch (error) {

                console.error(
                    "Failed to load user statistics:",
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
            title: "Total Users",
            value: Number(stats.totalUsers ?? 0),
            icon: <FiUsers />
        },
        {
            title: "Active Users",
            value: Number(stats.activeUsers ?? 0),
            icon: <FiUserCheck />
        },
        {
            title: "Inactive Users",
            value: Number(stats.inactiveUsers ?? 0),
            icon: <FiUserX />
        },
        {
            title: "Administrators",
            value: Number(stats.administrators ?? 0),
            icon: <FiShield />
        }
    ];

    return (
        <div className="user-stats">

            {statCards.map(stat => (

                <div
                    className="user-stat-card"
                    key={stat.title}
                >

                    <div className="user-stat-icon">
                        {stat.icon}
                    </div>

                    <div>

                        <span>
                            {stat.title}
                        </span>

                        <strong>
                            {loading ? "..." : stat.value}
                        </strong>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default UserStats;
