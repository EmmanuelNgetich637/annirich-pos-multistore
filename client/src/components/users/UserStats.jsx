import {
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiShield
} from "react-icons/fi";

function UserStats({ users }) {

    const total = users.length;

    const active = users.filter(
        user => user.status === "Active"
    ).length;

    const inactive = users.filter(
        user => user.status === "Inactive"
    ).length;

    const administrators = users.filter(
        user => user.role === "Administrator"
    ).length;

    const stats = [
        {
            title: "Total Users",
            value: total,
            icon: <FiUsers />
        },
        {
            title: "Active Users",
            value: active,
            icon: <FiUserCheck />
        },
        {
            title: "Inactive Users",
            value: inactive,
            icon: <FiUserX />
        },
        {
            title: "Administrators",
            value: administrators,
            icon: <FiShield />
        }
    ];

    return (
        <div className="user-stats">

            {stats.map(stat => (
                <div
                    className="user-stat-card"
                    key={stat.title}
                >
                    <div className="user-stat-icon">
                        {stat.icon}
                    </div>

                    <div>
                        <span>{stat.title}</span>
                        <strong>{stat.value}</strong>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default UserStats;