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

                <select
                    value={status}
                    onChange={e =>
                        setStatus(e.target.value)
                    }
                >

                    <option value="All">
                        All Status
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>

                </select>

            </div>

        </div>
    );
}

export default UserToolbar;
