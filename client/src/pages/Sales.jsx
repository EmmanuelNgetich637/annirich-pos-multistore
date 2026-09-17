import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";

import SalesStats from "../components/sales/SalesStats";
import SalesToolbar from "../components/sales/SalesToolbar";
import SalesTable from "../components/sales/SalesTable";
import SaleDetailsModal from "../components/sales/SaleDetailsModal";

import {
    getSales,
    getSale
} from "../api/saleApi";


function normalizeSale(sale) {

    const createdAt = sale.created_at
        ? new Date(sale.created_at)
        : null;

    const paymentMethod =
        sale.payment_method === "Mpesa"
            ? "M-Pesa"
            : sale.payment_method === "Cash"
                ? "Cash"
                : sale.payment_method || "Unknown";

    let status = "Pending";

    if (sale.payment_status === "paid") {
        status = "Completed";
    } else if (sale.payment_status === "failed") {
        status = "Failed";
    } else if (sale.payment_status === "cancelled") {
        status = "Cancelled";
    }

    return {
        ...sale,

        invoice: `SALE-${String(sale.id).padStart(5, "0")}`,

        customer:
            sale.customer_name ||
            "Walk-in Customer",

        cashier:
            sale.cashier_name ||
            "Unknown",

        date:
            createdAt
                ? createdAt.toLocaleDateString()
                : "—",

        time:
            createdAt
                ? createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
                : "—",

        items: Number(
            sale.items_count ?? 0
        ),

        paymentMethod,

        subtotal: Number(
            sale.subtotal ?? 0
        ),

        discount: Number(
            sale.discount ?? 0
        ),

        total: Number(
            sale.total ?? 0
        ),

        tax: 0,

        status
    };
}


function normalizeSaleDetails(sale) {

    const normalized = normalizeSale(sale);

    return {
        ...normalized,

        items: Array.isArray(sale.items)
            ? sale.items.map((item) => ({
                ...item,

                productName:
                    item.product_name ||
                    "Unknown Product",

                quantity: Number(
                    item.quantity ?? 0
                ),

                sellingPrice: Number(
                    item.selling_price ?? 0
                ),

                subtotal:
                    Number(
                        item.quantity ?? 0
                    ) *
                    Number(
                        item.selling_price ?? 0
                    )
            }))
            : []
    };
}


function Sales() {

    const [sales, setSales] = useState([]);

    const [search, setSearch] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("All");

    const [status, setStatus] =
        useState("All");

    const [selectedSale, setSelectedSale] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [detailsLoading, setDetailsLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const loadSales = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getSales();

            const saleData =
                response?.data || [];

            setSales(
                Array.isArray(saleData)
                    ? saleData.map(normalizeSale)
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load sales:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load sales."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadSales();

    }, []);


    const handleViewSale = async (sale) => {

        try {

            setDetailsLoading(true);
            setError("");

            const response =
                await getSale(sale.id);

            if (response?.data) {

                setSelectedSale(
                    normalizeSaleDetails(
                        response.data
                    )
                );

            } else {

                setSelectedSale(sale);

            }

        } catch (err) {

            console.error(
                "Failed to load sale details:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load sale details."
            );

        } finally {

            setDetailsLoading(false);

        }

    };


    const filteredSales =
        sales.filter((sale) => {

            const term =
                search.toLowerCase();

            const matchesSearch =
                sale.invoice
                    .toLowerCase()
                    .includes(term) ||

                sale.customer
                    .toLowerCase()
                    .includes(term) ||

                sale.cashier
                    .toLowerCase()
                    .includes(term);

            const matchesPayment =
                paymentMethod === "All" ||
                sale.paymentMethod ===
                    paymentMethod;

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
                subtitle="View and manage customer transactions."
            />


            {error && (
                <div className="error-state">
                    {error}
                </div>
            )}


            <SalesStats
                sales={sales}
            />


            <SalesToolbar
                search={search}
                setSearch={setSearch}

                paymentMethod={
                    paymentMethod
                }

                setPaymentMethod={
                    setPaymentMethod
                }

                status={status}
                setStatus={setStatus}
            />


            {loading ? (

                <div className="loading-state">
                    Loading sales...
                </div>

            ) : (

                <SalesTable
                    sales={filteredSales}
                    onView={handleViewSale}
                />

            )}


            {detailsLoading && (

                <div className="loading-state">
                    Loading sale details...
                </div>

            )}


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
