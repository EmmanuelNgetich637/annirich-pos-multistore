import { FiPlus, FiSearch } from "react-icons/fi";

function TableToolbar({
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    action
}) {

    return (

        <div className="table-toolbar">

            <div className="toolbar-left">

                <div className="search-box">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >

                    <option value="All">
                        All Categories
                    </option>

                    <option value="Paints">
                        Paints
                    </option>

                    <option value="Plumbing">
                        Plumbing
                    </option>

                </select>

                <select
                    value={status}
                    onChange={(e) =>
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

            {action}

        </div>

    );

}

export default TableToolbar;