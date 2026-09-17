import { FiSearch } from "react-icons/fi";

function TableToolbar({
    search,
    setSearch,
    category,
    setCategory,
    categories = [],
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
                        placeholder="Search..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {setCategory &&
                    categories.length > 0 && (
                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(
                                    e.target.value
                                )
                            }
                        >

                            <option value="All">
                                All Categories
                            </option>

                            {categories.map(
                                (item) => (
                                    <option
                                        key={item.id}
                                        value={
                                            item.name
                                        }
                                    >
                                        {item.name}
                                    </option>
                                )
                            )}

                        </select>
                    )}

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