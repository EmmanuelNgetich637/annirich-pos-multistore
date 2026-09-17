import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import CustomerStats from "../components/customers/CustomerStats";
import CustomerRow from "../components/customers/CustomerRow";
import CustomerModal from "../components/customers/CustomerModal";

import {
    getCustomers,
    deleteCustomer
} from "../api/customerApi";


function Customers() {

    const [customers, setCustomers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("All");

    const [openModal, setOpenModal] =
        useState(false);

    const [editingCustomer, setEditingCustomer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const columns = [
        "Customer",
        "Phone",
        "Email",
        "Purchases",
        "Total Spent",
        "Balance",
        "Status",
        "Actions"
    ];


    const loadCustomers = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getCustomers();

            const customerData =
                response?.data || [];

            setCustomers(
                Array.isArray(customerData)
                    ? customerData
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load customers:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load customers."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCustomers();

    }, []);


    const handleAdd = () => {

        setEditingCustomer(null);
        setOpenModal(true);

    };


    const handleEdit = (customer) => {

        setEditingCustomer(customer);
        setOpenModal(true);

    };


    const handleCloseModal = () => {

        setOpenModal(false);
        setEditingCustomer(null);

    };


    const handleDelete = async (customer) => {

        const confirmed =
            window.confirm(
                `Delete "${customer.name}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteCustomer(
                customer.id
            );

            await loadCustomers();

        } catch (err) {

            console.error(
                "Failed to delete customer:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to delete customer."
            );

        }

    };


    const filteredCustomers =
        customers.filter((customer) => {

            const searchTerm =
                search.toLowerCase();

            const name =
                customer.name || "";

            const phone =
                customer.phone || "";

            const email =
                customer.email || "";

            const matchesSearch =
                name.toLowerCase().includes(searchTerm) ||
                phone.toLowerCase().includes(searchTerm) ||
                email.toLowerCase().includes(searchTerm);

            const customerStatus =
                String(
                    customer.status || ""
                ).toLowerCase();

            const matchesStatus =
                status === "All" ||
                customerStatus ===
                    status.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus
            );

        });


    return (
        <>

            <PageHeader
                title="Customers"
                subtitle="Manage your customers and account balances."
                action={
                    <button
                        className="primary-btn"
                        onClick={handleAdd}
                    >
                        Add Customer
                    </button>
                }
            />


            <CustomerStats />


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
                        Add Customer
                    </button>
                }
            />


            {loading && (
                <div className="loading-state">
                    Loading customers...
                </div>
            )}


            {error && (
                <div className="error-state">
                    {error}
                </div>
            )}


            {!loading && !error && (

                <>

                    <DataTable
                        columns={columns}
                    >

                        {filteredCustomers.map(
                            (customer) => (

                                <CustomerRow
                                    key={customer.id}
                                    customer={customer}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />

                            )
                        )}

                    </DataTable>


                    {filteredCustomers.length === 0 && (
                        <div className="empty-state">
                            No customers found.
                        </div>
                    )}

                </>

            )}


            <CustomerModal
                open={openModal}
                onClose={handleCloseModal}
                onSaved={loadCustomers}
                customer={editingCustomer}
            />

        </>
    );
}


export default Customers;
