import { useState } from "react";

import PageHeader from "../components/common/PageHeader";
import UserStats from "../components/users/UserStats";
import UserToolbar from "../components/users/UserToolbar";
import UserTable from "../components/users/UserTable";
import UserModal from "../components/users/UserModal";

import usersData from "../data/users";

function Users() {

    const [users] = useState(usersData);

    const [search, setSearch] = useState("");
    const [role, setRole] = useState("All");
    const [status, setStatus] = useState("All");

    const [openModal, setOpenModal] =
        useState(false);

    const [selectedUser, setSelectedUser] =
        useState(null);

    const filteredUsers = users.filter(user => {

        const term = search.toLowerCase();

        const matchesSearch =
            user.name
                .toLowerCase()
                .includes(term) ||
            user.email
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

    const handleEdit = user => {
        setSelectedUser(user);
        setOpenModal(true);
    };

    const handleDelete = user => {
        console.log(
            "Delete user:",
            user
        );
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

            <UserStats
                users={users}
            />

            <UserToolbar
                search={search}
                setSearch={setSearch}
                role={role}
                setRole={setRole}
                status={status}
                setStatus={setStatus}
            />

            <UserTable
                users={filteredUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <UserModal
                open={openModal}
                user={selectedUser}
                onClose={() =>
                    setOpenModal(false)
                }
            />

        </div>
    );
}

export default Users;