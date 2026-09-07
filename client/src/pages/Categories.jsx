import { useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import CategoryStats from "../components/categories/CategoryStats";
import CategoryRow from "../components/categories/CategoryRow";
import CategoryModal from "../components/categories/CategoryModal";

import categories from "../data/categories";

function Categories() {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [openModal, setOpenModal] = useState(false);

    const columns = [
        "Category",
        "Description",
        "Products",
        "Status",
        "Actions"
    ];

    const filteredCategories = categories.filter(
        (category) => {

            const matchesSearch =
                category.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                category.description
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                status === "All" ||
                category.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    return (
        <>

            <PageHeader
                title="Categories"
                subtitle="Organize and manage your product categories."
                action={
                    <button
                        className="primary-btn"
                        onClick={() =>
                            setOpenModal(true)
                        }
                    >
                        Add Category
                    </button>
                }
            />

            <CategoryStats />

            <TableToolbar
                search={search}
                setSearch={setSearch}
                category="All"
                setCategory={() => {}}
                status={status}
                setStatus={setStatus}
                action={
                    <button
                        className="primary-btn"
                        onClick={() =>
                            setOpenModal(true)
                        }
                    >
                        Add Category
                    </button>
                }
            />

            <DataTable columns={columns}>

                {filteredCategories.map(
                    (category) => (
                        <CategoryRow
                            key={category.id}
                            category={category}
                        />
                    )
                )}

            </DataTable>

            <CategoryModal
                open={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
            />

        </>
    );
}

export default Categories;