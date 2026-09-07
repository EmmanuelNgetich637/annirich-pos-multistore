import {
    FiEdit2,
    FiTrash2,
    FiMoreVertical
} from "react-icons/fi";

function UserTable({
    users,
    onEdit,
    onDelete
}) {
    return (
        <div className="user-table-container">

            <table className="user-table">

                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map(user => (
                        <tr key={user.id}>

                            <td>
                                <div className="user-profile">

                                    <div className="user-avatar">
                                        {user.initials}
                                    </div>

                                    <div>
                                        <strong>
                                            {user.name}
                                        </strong>

                                        <span>
                                            {user.email}
                                        </span>
                                    </div>

                                </div>
                            </td>

                            <td>
                                <span className="role-badge">
                                    {user.role}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={
                                        user.status === "Active"
                                            ? "status-badge completed"
                                            : "status-badge cancelled"
                                    }
                                >
                                    {user.status}
                                </span>
                            </td>

                            <td>
                                <span className="last-login">
                                    {user.lastLogin}
                                </span>
                            </td>

                            <td>

                                <div className="user-actions">

                                    <button
                                        title="Edit"
                                        onClick={() =>
                                            onEdit(user)
                                        }
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button
                                        title="Delete"
                                        onClick={() =>
                                            onDelete(user)
                                        }
                                    >
                                        <FiTrash2 />
                                    </button>

                                    <button title="More">
                                        <FiMoreVertical />
                                    </button>

                                </div>

                            </td>

                        </tr>
                    ))}

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