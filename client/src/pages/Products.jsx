import { useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";
import ProductRow from "../components/products/ProductRow";
import ProductStats from "../components/products/ProductStats";
import ProductModal from "../components/products/ProductModal";

import products from "../data/products";

function Products() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [openModal, setOpenModal] = useState(false);

    const columns = [
        "Barcode",
        "Product",
        "Category",
        "Buying",
        "Selling",
        "Stock",
        "Status",
        "Actions"
    ];

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.barcode.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            category === "All" ||
            product.category === category;

        const matchesStatus =
            status === "All" ||
            product.status === status;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
        );
    });

    return (
        <>
            <PageHeader
                title="Products"
                subtitle="Manage your inventory products."
                action={
                    <button
                        className="primary-btn"
                        onClick={() => setOpenModal(true)}
                    >
                        Add Product
                    </button>
                }
            />

            <ProductStats />

            <TableToolbar
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                status={status}
                setStatus={setStatus}
                action={
                    <button
                        className="primary-btn"
                        onClick={() => setOpenModal(true)}
                    >
                        Add Product
                    </button>
                }
            />

            <DataTable columns={columns}>
                {filteredProducts.map((product) => (
                    <ProductRow
                        key={product.id}
                        product={product}
                    />
                ))}
            </DataTable>

            <ProductModal
                open={openModal}
                onClose={() => setOpenModal(false)}
            />
        </>
    );
}

export default Products;