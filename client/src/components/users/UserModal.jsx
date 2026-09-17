import { useEffect, useState } from "react";

import {
    createUser,
    updateUser
} from "../../api/userApi";

function UserModal({
    open,
    user,
    onClose,
    onSaved
}) {

    const isEditing = Boolean(user);

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        role: "cashier"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!open) {
            return;
        }

        if (user) {

            setFormData({
                full_name: user.full_name || "",
                username: user.username || "",
                email: user.email || "",
                password: "",
                role: user.role || "cashier"
            });

        } else {

            setFormData({
                full_name: "",
                username: "",
                email: "",
                password: "",
                role: "cashier"
            });

        }

        setError("");

    }, [open, user]);

    if (!open) {
        return null;
    }

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            if (isEditing) {

                const payload = {
                    full_name: formData.full_name,
                    username: formData.username,
                    email: formData.email,
                    role: formData.role
                };

                if (formData.password.trim()) {
                    payload.password = formData.password;
                }

                await updateUser(
                    user.id,
                    payload
                );

            } else {

                await createUser({
                    full_name: formData.full_name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });

            }

            onSaved?.();

            onClose();

        } catch (err) {

            console.error(
                "Failed to save user:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.errors?.[0]?.msg ||
                "Failed to save user."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="modal-overlay">

            <div className="user-modal">

                <div className="user-modal-header">

                    <div>
                        <h2>
                            {isEditing
                                ? "Edit User"
                                : "Add User"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update user details and access role."
                                : "Create a new system user."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>

                </div>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Role
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >

                            <option value="admin">
                                Administrator
                            </option>

                            <option value="manager">
                                Manager
                            </option>

                            <option value="cashier">
                                Cashier
                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>
                            {isEditing
                                ? "New Password (optional)"
                                : "Temporary Password"}
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                                isEditing
                                    ? "Leave blank to keep current password"
                                    : "Enter temporary password"
                            }
                            required={!isEditing}
                            minLength={6}
                        />

                    </div>

                    {isEditing && (

                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <input
                                type="text"
                                value={
                                    user.status === "active"
                                        ? "Active"
                                        : "Inactive"
                                }
                                disabled
                            />

                            <small>
                                Use the user status controls to change account status.
                            </small>

                        </div>

                    )}

                    <div className="user-modal-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Create User"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default UserModal;
