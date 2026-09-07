import { useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";

import CustomerStats from "../components/customers/CustomerStats";
import CustomerRow from "../components/customers/CustomerRow";
import CustomerModal from "../components/customers/CustomerModal";

import customers from "../data/customers";

function Customers() {

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [openModal, setOpenModal] = useState(false);

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

    const filteredCustomers = customers.filter(
        (customer) => {

            const searchTerm =
                search.toLowerCase();

            const matchesSearch =
                customer.name
                    .toLowerCase()
                    .includes(searchTerm) ||
                customer.phone
                    .toLowerCase()
                    .includes(searchTerm) ||
                customer.email
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesStatus =
                status === "All" ||
                customer.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );

    return (
        <>

            <PageHeader
                title="Customers"
                subtitle="Manage your customers and account balances."
                action={
                    <button
                        className="primary-btn"
                        onClick={() =>
                            setOpenModal(true)
                        }
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
                        onClick={() =>
                            setOpenModal(true)
                        }
                    >
                        Add Customer
                    </button>
                }
            />

            <DataTable columns={columns}>

                {filteredCustomers.map(
                    (customer) => (
                        <CustomerRow
                            key={customer.id}
                            customer={customer}
                        />
                    )
                )}

            </DataTable>

            <CustomerModal
                open={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
            />

        </>
    );
}

export default Customers;