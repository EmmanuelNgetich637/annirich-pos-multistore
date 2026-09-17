import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import SupplierStats from "../components/suppliers/SupplierStats";
import SupplierRow from "../components/suppliers/SupplierRow";
import SupplierModal from "../components/suppliers/SupplierModal";

import {
    getSuppliers,
    deleteSupplier
} from "../api/supplierApi";

function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [openModal, setOpenModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const columns = [
        "Supplier",
        "Contact Person",
        "Phone",
        "Email",
        "Purchases",
        "Balance",
        "Status",
        "Actions"
    ];

    const loadSuppliers = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getSuppliers();

            setSuppliers(
                response?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load suppliers:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to load suppliers."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadSuppliers();

    }, []);

    const handleAdd = () => {

        setEditingSupplier(null);
        setOpenModal(true);

    };

    const handleEdit = (supplier) => {

        setEditingSupplier(supplier);
        setOpenModal(true);

    };

    const handleCloseModal = () => {

        setOpenModal(false);
        setEditingSupplier(null);

    };

    const handleDelete = async (supplier) => {

        const confirmed = window.confirm(
            `Delete supplier "${supplier.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteSupplier(
                supplier.id
            );

            await loadSuppliers();

        } catch (error) {

            window.alert(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to delete supplier."
            );

        }
    };

    const searchTerm =
        search.trim().toLowerCase();

    const filteredSuppliers =
        suppliers.filter((supplier) => {

            const matchesSearch =
                !searchTerm ||
                String(
                    supplier.name || ""
                ).toLowerCase().includes(searchTerm) ||
                String(
                    supplier.contact_person || ""
                ).toLowerCase().includes(searchTerm) ||
                String(
                    supplier.phone || ""
                ).toLowerCase().includes(searchTerm) ||
                String(
                    supplier.email || ""
                ).toLowerCase().includes(searchTerm) ||
                String(
                    supplier.address || ""
                ).toLowerCase().includes(searchTerm);

            const normalizedStatus =
                supplier.status === "active"
                    ? "Active"
                    : "Inactive";

            const matchesStatus =
                status === "All" ||
                normalizedStatus === status;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    return (

        <>

            <PageHeader
                title="Suppliers"
                subtitle="Manage your suppliers and supplier balances."
                action={
                    <button
                        className="primary-btn"
                        onClick={handleAdd}
                    >
                        Add Supplier
                    </button>
                }
            />

            <SupplierStats />

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
                        Add Supplier
                    </button>
                }
            />

            {error && (

                <div className="form-error">
                    {error}
                </div>

            )}

            <DataTable columns={columns}>

                {loading ? (

                    <tr>

                        <td
                            colSpan={columns.length}
                            style={{
                                textAlign: "center"
                            }}
                        >
                            Loading suppliers...
                        </td>

                    </tr>

                ) : filteredSuppliers.length === 0 ? (

                    <tr>

                        <td
                            colSpan={columns.length}
                            style={{
                                textAlign: "center"
                            }}
                        >
                            No suppliers found.
                        </td>

                    </tr>

                ) : (

                    filteredSuppliers.map(
                        (supplier) => (

                            <SupplierRow
                                key={supplier.id}
                                supplier={supplier}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />

                        )
                    )

                )}

            </DataTable>

            <SupplierModal
                open={openModal}
                onClose={handleCloseModal}
                onSaved={loadSuppliers}
                supplier={editingSupplier}
            />

        </>

    );
}

export default Suppliers;
