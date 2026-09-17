import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import UserStats from "../components/users/UserStats";
import UserToolbar from "../components/users/UserToolbar";
import UserTable from "../components/users/UserTable";
import UserModal from "../components/users/UserModal";

import {
    getUsers,
    deleteUser,
    updateUserStatus
} from "../api/userApi";

function Users() {

    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All");
    const [status, setStatus] = useState("All");

    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getUsers();

            setUsers(response?.data || []);

        } catch (err) {

            console.error(
                "Failed to load users:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load users."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = users.filter(user => {

        const term = search
            .trim()
            .toLowerCase();

        const matchesSearch =
            !term ||
            String(user.full_name || "")
                .toLowerCase()
                .includes(term) ||
            String(user.username || "")
                .toLowerCase()
                .includes(term) ||
            String(user.email || "")
                .toLowerCase()
                .includes(term);

        const matchesRole =
            role === "All" ||
            user.role === role;

        const matchesStatus =
            status === "All" ||
            user.status === status;

        return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
        );
    });

    const handleAdd = () => {

        setSelectedUser(null);
        setOpenModal(true);

    };

    const handleEdit = (user) => {

        setSelectedUser(user);
        setOpenModal(true);

    };

    const handleDelete = async (user) => {

        const confirmed = window.confirm(
            `Deactivate ${user.full_name}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteUser(user.id);

            await loadUsers();

        } catch (err) {

            console.error(
                "Failed to deactivate user:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Failed to deactivate user."
            );

        }
    };

    const handleToggleStatus = async (user) => {

        const newStatus =
            user.status === "active"
                ? "inactive"
                : "active";

        try {

            await updateUserStatus(
                user.id,
                newStatus
            );

            await loadUsers();

        } catch (err) {

            console.error(
                "Failed to update user status:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Failed to update user status."
            );

        }
    };

    return (
        <div className="users-page">

            <PageHeader
                title="Users"
                subtitle="Manage system users and access roles."
                action={
                    <button
                        className="primary-btn"
                        onClick={handleAdd}
                    >
                        Add User
                    </button>
                }
            />

            <UserStats />

            <UserToolbar
                search={search}
                setSearch={setSearch}
                role={role}
                setRole={setRole}
                status={status}
                setStatus={setStatus}
            />

            {error && (

                <div className="form-error">
                    {error}
                </div>

            )}

            {loading ? (

                <div className="user-empty">
                    Loading users...
                </div>

            ) : (

                <UserTable
                    users={filteredUsers}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />

            )}

            <UserModal
                open={openModal}
                user={selectedUser}
                onClose={() => {
                    setOpenModal(false);
                    setSelectedUser(null);
                }}
                onSaved={loadUsers}
            />

        </div>
    );
}

export default Users;
