import {
    FiEdit2,
    FiTrash2,
    FiMoreVertical
} from "react-icons/fi";

function getInitials(name = "") {

    return name
        .trim()
        .split(/\s+/)
        .map(part => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function formatRole(role) {

    const roles = {
        admin: "Administrator",
        manager: "Manager",
        cashier: "Cashier"
    };

    return roles[role] || role || "—";
}

function UserTable({
    users,
    onEdit,
    onDelete,
    onToggleStatus
}) {

    return (
        <div className="user-table-container">

            <table className="user-table">

                <thead>

                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {users.map(user => {

                        const isActive =
                            String(user.status || "")
                                .toLowerCase() === "active";

                        return (

                            <tr key={user.id}>

                                <td>

                                    <div className="user-profile">

                                        <div className="user-avatar">
                                            {getInitials(
                                                user.full_name
                                            )}
                                        </div>

                                        <div>

                                            <strong>
                                                {user.full_name || "—"}
                                            </strong>

                                            <span>
                                                {user.email || "—"}
                                            </span>

                                        </div>

                                    </div>

                                </td>

                                <td>

                                    <span className="role-badge">
                                        {formatRole(user.role)}
                                    </span>

                                </td>

                                <td>

                                    <button
                                        type="button"
                                        className={
                                            isActive
                                                ? "status-badge completed"
                                                : "status-badge cancelled"
                                        }
                                        onClick={() =>
                                            onToggleStatus?.(user)
                                        }
                                        title={
                                            isActive
                                                ? "Deactivate user"
                                                : "Activate user"
                                        }
                                    >
                                        {isActive
                                            ? "Active"
                                            : "Inactive"}
                                    </button>

                                </td>

                                <td>

                                    <div className="user-actions">

                                        <button
                                            title="Edit"
                                            onClick={() =>
                                                onEdit?.(user)
                                            }
                                        >
                                            <FiEdit2 />
                                        </button>

                                        <button
                                            title="Deactivate"
                                            onClick={() =>
                                                onDelete?.(user)
                                            }
                                        >
                                            <FiTrash2 />
                                        </button>

                                        <button
                                            title="More"
                                        >
                                            <FiMoreVertical />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

            {users.length === 0 && (

                <div className="user-empty">
                    No users found.
                </div>

            )}

        </div>
    );
}

export default UserTable;
