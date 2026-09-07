import { useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import SupplierStats from "../components/suppliers/SupplierStats";
import SupplierRow from "../components/suppliers/SupplierRow";
import SupplierModal from "../components/suppliers/SupplierModal";

import suppliers from "../data/suppliers";

function Suppliers() {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [openModal, setOpenModal] = useState(false);

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

    const filteredSuppliers = suppliers.filter(
        (supplier) => {

            const searchTerm =
                search.toLowerCase();

            const matchesSearch =
                supplier.name
                    .toLowerCase()
                    .includes(searchTerm) ||
                supplier.contactPerson
                    .toLowerCase()
                    .includes(searchTerm) ||
                supplier.phone
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesStatus =
                status === "All" ||
                supplier.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    return (
        <>

            <PageHeader
                title="Suppliers"
                subtitle="Manage your suppliers and supplier balances."
                action={
                    <button
                        className="primary-btn"
                        onClick={() =>
                            setOpenModal(true)
                        }
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
                        onClick={() =>
                            setOpenModal(true)
                        }
                    >
                        Add Supplier
                    </button>
                }
            />

            <DataTable columns={columns}>

                {filteredSuppliers.map(
                    (supplier) => (
                        <SupplierRow
                            key={supplier.id}
                            supplier={supplier}
                        />
                    )
                )}

            </DataTable>

            <SupplierModal
                open={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
            />

        </>
    );
}

export default Suppliers;