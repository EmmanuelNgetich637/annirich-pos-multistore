import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

function UserModal({
    open,
    onClose,
    user
}) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Cashier");
    const [status, setStatus] = useState("Active");

    useEffect(() => {

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
            setStatus(user.status);
        } else {
            setName("");
            setEmail("");
            setRole("Cashier");
            setStatus("Active");
        }

    }, [user, open]);

    if (!open) {
        return null;
    }

    const handleSubmit = e => {
        e.preventDefault();

        // UI only for now.
        onClose();
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="user-modal"
                onClick={e =>
                    e.stopPropagation()
                }
            >

                <div className="user-modal-header">

                    <div>
                        <span>
                            {user
                                ? "Edit User"
                                : "New User"}
                        </span>

                        <h2>
                            {user
                                ? "Update user"
                                : "Create user"}
                        </h2>
                    </div>

                    <button onClick={onClose}>
                        <FiX />
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={e =>
                                setName(e.target.value)
                            }
                            placeholder="Enter full name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={e =>
                                setEmail(e.target.value)
                            }
                            placeholder="user@annirich.co.ke"
                            required
                        />

                    </div>

                    <div className="user-form-row">

                        <div className="form-group">

                            <label>
                                Role
                            </label>

                            <select
                                value={role}
                                onChange={e =>
                                    setRole(e.target.value)
                                }
                            >
                                <option value="Administrator">
                                    Administrator
                                </option>

                                <option value="Manager">
                                    Manager
                                </option>

                                <option value="Cashier">
                                    Cashier
                                </option>

                                <option value="Inventory Manager">
                                    Inventory Manager
                                </option>
                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={e =>
                                    setStatus(e.target.value)
                                }
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </select>

                        </div>

                    </div>

                    {!user && (
                        <div className="form-group">

                            <label>
                                Temporary Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter temporary password"
                            />

                        </div>
                    )}

                    <div className="user-modal-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            {user
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