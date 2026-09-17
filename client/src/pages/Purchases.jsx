import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import PurchaseStats from "../components/purchases/PurchaseStats";
import PurchaseRow from "../components/purchases/PurchaseRow";
import PurchaseModal from "../components/purchases/PurchaseModal";
import PurchaseDetailsModal from "../components/purchases/PurchaseDetailsModal";

import {
    getPurchases
} from "../api/purchaseApi";

function Purchases() {

    const [purchases, setPurchases] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const [openModal, setOpenModal] =
        useState(false);

    const [selectedPurchase, setSelectedPurchase] =
        useState(null);

    const [openDetails, setOpenDetails] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const columns = [
        "Reference",
        "Supplier",
        "Date",
        "Items",
        "Total",
        "Status",
        "Actions"
    ];

    const loadPurchases = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getPurchases();

            setPurchases(
                response?.data || []
            );

        } catch (err) {

            console.error(
                "Failed to load purchases:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load purchases."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadPurchases();
    }, []);

    const filteredPurchases =
        purchases.filter((purchase) => {

            const searchTerm =
                search
                    .toLowerCase()
                    .trim();

            const reference =
                (
                    purchase.invoice_number ||
                    `PUR-${purchase.id}`
                ).toLowerCase();

            const supplier =
                (
                    purchase.supplier_name ||
                    ""
                ).toLowerCase();

            const matchesSearch =
                reference.includes(searchTerm) ||
                supplier.includes(searchTerm);

            const matchesStatus =
                status === "All" ||
                purchase.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    const handlePurchaseSaved =
        async () => {

            setOpenModal(false);

            await loadPurchases();

        };

    const handleViewPurchase =
        (purchase) => {

            setSelectedPurchase(
                purchase
            );

            setOpenDetails(true);

        };

    const handleCloseDetails =
        () => {

            setOpenDetails(false);
            setSelectedPurchase(null);

        };

    return (
        <>
            <PageHeader
                title="Purchases"
                subtitle="Manage stock purchases and supplier records."
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

            {loading && (
                <div className="empty-state">
                    Loading purchases...
                </div>
            )}

            {!loading && error && (
                <div className="empty-state">
                    {error}
                </div>
            )}

            {!loading &&
                !error && (
                    <DataTable
                        columns={columns}
                    >

                        {filteredPurchases.map(
                            (purchase) => (

                                <PurchaseRow
                                    key={purchase.id}
                                    purchase={purchase}
                                    onView={
                                        handleViewPurchase
                                    }
                                />

                            )
                        )}

                    </DataTable>
                )}

            {!loading &&
                !error &&
                filteredPurchases.length === 0 && (
                    <div className="empty-state">
                        No purchases found.
                    </div>
                )}

            <PurchaseModal
                open={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
                onSaved={
                    handlePurchaseSaved
                }
            />

            <PurchaseDetailsModal
                open={openDetails}
                purchase={
                    selectedPurchase
                }
                onClose={
                    handleCloseDetails
                }
                onUpdated={
                    loadPurchases
                }
            />

        </>
    );
}

export default Purchases;
