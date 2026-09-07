import { useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import PurchaseStats from "../components/purchases/PurchaseStats";
import PurchaseRow from "../components/purchases/PurchaseRow";
import PurchaseModal from "../components/purchases/PurchaseModal";

import purchases from "../data/purchases";

function Purchases() {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [openModal, setOpenModal] = useState(false);

    const columns = [
        "Reference",
        "Supplier",
        "Date",
        "Items",
        "Total",
        "Paid",
        "Balance",
        "Status",
        "Actions"
    ];

    const filteredPurchases =
        purchases.filter((purchase) => {

            const searchTerm =
                search.toLowerCase();

            const matchesSearch =
                purchase.reference
                    .toLowerCase()
                    .includes(searchTerm) ||
                purchase.supplier
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesStatus =
                status === "All" ||
                purchase.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    return (
        <>

            <PageHeader
                title="Purchases"
                subtitle="Manage stock purchases and supplier payments."
                action={
                    <button
                        className="primary-btn"
                        onClick={() =>
                            setOpenModal(true)
                        }
                    >
                        New Purchase
                    </button>
                }
            />

            <PurchaseStats />

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
                        New Purchase
                    </button>
                }
            />

            <DataTable columns={columns}>

                {filteredPurchases.map(
                    (purchase) => (
                        <PurchaseRow
                            key={purchase.id}
                            purchase={purchase}
                        />
                    )
                )}

            </DataTable>

            <PurchaseModal
                open={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
            />

        </>
    );
}

export default Purchases;