import { useState } from "react";

import PageHeader from "../components/common/PageHeader";

import SalesStats from "../components/sales/SalesStats";
import SalesToolbar from "../components/sales/SalesToolbar";
import SalesTable from "../components/sales/SalesTable";
import SaleDetailsModal from "../components/sales/SaleDetailsModal";

import sales from "../data/sales";

function Sales() {

    const [search, setSearch] = useState("");
    const [paymentMethod, setPaymentMethod] =
        useState("All");
    const [status, setStatus] =
        useState("All");

    const [selectedSale, setSelectedSale] =
        useState(null);

    const filteredSales = sales.filter((sale) => {

        const term = search.toLowerCase();

        const matchesSearch =
            sale.invoice.toLowerCase().includes(term) ||
            sale.customer.toLowerCase().includes(term) ||
            sale.cashier.toLowerCase().includes(term);

        const matchesPayment =
            paymentMethod === "All" ||
            sale.paymentMethod === paymentMethod;

        const matchesStatus =
            status === "All" ||
            sale.status === status;

        return (
            matchesSearch &&
            matchesPayment &&
            matchesStatus
        );
    });

    return (
        <div className="sales-page">

            <PageHeader
                title="Sales"
                subtitle="View and manage completed customer transactions."
            />

            <SalesStats sales={sales} />

            <SalesToolbar
                search={search}
                setSearch={setSearch}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                status={status}
                setStatus={setStatus}
            />

            <SalesTable
                sales={filteredSales}
                onView={setSelectedSale}
            />

            <SaleDetailsModal
                sale={selectedSale}
                onClose={() =>
                    setSelectedSale(null)
                }
            />

        </div>
    );
}

export default Sales;