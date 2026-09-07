import { FiSearch, FiFilter } from "react-icons/fi";

function UserToolbar({
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus
}) {
    return (
        <div className="user-toolbar">

            <div className="user-search">
                <FiSearch />

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={e =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            <div className="user-filters">

                <div className="user-filter">
                    <FiFilter />

                    <select
                        value={role}
                        onChange={e =>
                            setRole(e.target.value)
                        }
                    >
                        <option value="All">
                            All Roles
                        </option>

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

                <select
                    value={status}
                    onChange={e =>
                        setStatus(e.target.value)
                    }
                >
                    <option value="All">
                        All Status
                    </option>

                    <option value="Active">
                        Active
                    </option>

                    <option value="Inactive">
                        Inactive
                    </option>
                </select>

            </div>

        </div>
    );
}

export default UserToolbar;