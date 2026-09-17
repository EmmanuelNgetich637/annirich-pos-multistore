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

    const [selectedDate, setSelectedDate] =
        useState("");

    const [exporting, setExporting] =
        useState(false);

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

            const matchesDate =
                !selectedDate ||
                (
                    sale.created_at &&
                    new Date(sale.created_at)
                        .toISOString()
                        .slice(0, 10) === selectedDate
                );

            return (
                matchesSearch &&
                matchesPayment &&
                matchesStatus &&
                matchesDate
            );

        });


    const handleExport = async () => {

        try {

            setExporting(true);

            const response =
                await getSales();

            const saleData =
                response?.data || [];

            let exportSales =
                Array.isArray(saleData)
                    ? saleData.map(normalizeSale)
                    : [];


            if (selectedDate) {

                exportSales =
                    exportSales.filter((sale) => {

                        if (!sale.created_at) {
                            return false;
                        }

                        return (
                            new Date(sale.created_at)
                                .toISOString()
                                .slice(0, 10) === selectedDate
                        );

                    });

            }


            const term =
                search.toLowerCase();


            exportSales =
                exportSales.filter((sale) => {

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


            if (exportSales.length === 0) {

                alert(
                    "No sales found for the selected filters."
                );

                return;

            }


            const headers = [
                "Invoice",
                "Customer",
                "Cashier",
                "Date",
                "Time",
                "Payment Method",
                "Status",
                "Subtotal",
                "Discount",
                "Total"
            ];


            const rows =
                exportSales.map((sale) => [

                    sale.invoice,

                    sale.customer,

                    sale.cashier,

                    sale.date,

                    sale.time,

                    sale.paymentMethod,

                    sale.status,

                    sale.subtotal,

                    sale.discount,

                    sale.total

                ]);


            const csvRows = [
                headers,
                ...rows
            ];


            const csv =
                csvRows
                    .map((row) =>
                        row
                            .map((value) => {

                                const text =
                                    String(
                                        value ?? ""
                                    );

                                return `"${text.replace(
                                    /"/g,
                                    '""'
                                )}"`;

                            })
                            .join(",")
                    )
                    .join("\r\n");


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                selectedDate
                    ? `sales-${selectedDate}.csv`
                    : "sales-export.csv";


            link.style.display =
                "none";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            setTimeout(() => {

                URL.revokeObjectURL(url);

            }, 1000);


        } catch (err) {

            console.error(
                "Export failed:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Failed to export sales."
            );

        } finally {

            setExporting(false);

        }

    };


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

                setStatus={
                    setStatus
                }

                selectedDate={
                    selectedDate
                }

                setSelectedDate={
                    setSelectedDate
                }

                onExport={
                    handleExport
                }

                exporting={
                    exporting
                }

            />


            {loading ? (

                <div className="loading-state">

                    Loading sales...

                </div>

            ) : (

                <SalesTable

                    sales={
                        filteredSales
                    }

                    onView={
                        handleViewSale
                    }

                />

            )}


            {detailsLoading && (

                <div className="loading-state">

                    Loading sale details...

                </div>

            )}


            <SaleDetailsModal

                sale={
                    selectedSale
                }

                onClose={() =>
                    setSelectedSale(null)
                }

            />

        </div>

    );

}


export default Sales; 