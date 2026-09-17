import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import CategoryStats from "../components/categories/CategoryStats";
import CategoryRow from "../components/categories/CategoryRow";
import CategoryModal from "../components/categories/CategoryModal";

import {
    getCategories,
    deleteCategory
} from "../api/categoryApi";

function Categories() {

    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [openModal, setOpenModal] =
        useState(false);

    const [editingCategory, setEditingCategory] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const columns = [
        "Category",
        "Description",
        "Products",
        "Status",
        "Actions"
    ];

    const loadCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getCategories();

            const categoryData =
                response?.data || [];

            setCategories(
                Array.isArray(categoryData)
                    ? categoryData
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load categories:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load categories."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        loadCategories();
    }, []);


    const handleAdd = () => {

        setEditingCategory(null);
        setOpenModal(true);

    };


    const handleEdit = (category) => {

        setEditingCategory(category);
        setOpenModal(true);

    };


    const handleCloseModal = () => {

        setOpenModal(false);
        setEditingCategory(null);

    };


    const handleDelete = async (category) => {

        const confirmed =
            window.confirm(
                `Delete "${category.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeleteLoading(true);
            setError("");

            await deleteCategory(
                category.id
            );

            await loadCategories();

        } catch (err) {

            console.error(
                "Failed to delete category:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to delete category."
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    const filteredCategories =
        categories.filter(
            (category) => {

                const name =
                    category.name || "";

                const description =
                    category.description || "";

                const categoryStatus =
                    String(
                        category.status || ""
                    ).toLowerCase();

                const searchTerm =
                    search.toLowerCase();

                const matchesSearch =
                    name
                        .toLowerCase()
                        .includes(searchTerm) ||
                    description
                        .toLowerCase()
                        .includes(searchTerm);

                const matchesStatus =
                    status === "All" ||
                    categoryStatus ===
                        status.toLowerCase();

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
                        onClick={handleAdd}
                    >
                        Add Category
                    </button>
                }
            />


            <CategoryStats
                categories={categories}
            />


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
                        onClick={handleAdd}
                    >
                        Add Category
                    </button>
                }
            />


            {loading && (
                <div className="loading-state">
                    Loading categories...
                </div>
            )}


            {error && (
                <div className="error-state">
                    {error}
                </div>
            )}


            {deleteLoading && (
                <div className="loading-state">
                    Deleting category...
                </div>
            )}


            {!loading && !error && (
                <>

                    <DataTable
                        columns={columns}
                    >

                        {filteredCategories.map(
                            (category) => (

                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />

                            )
                        )}

                    </DataTable>


                    {filteredCategories.length === 0 && (
                        <div className="empty-state">
                            No categories found.
                        </div>
                    )}

                </>
            )}


            <CategoryModal
                open={openModal}
                onClose={handleCloseModal}
                onCreated={loadCategories}
                category={editingCategory}
            />

        </>
    );

}

export default Categories;