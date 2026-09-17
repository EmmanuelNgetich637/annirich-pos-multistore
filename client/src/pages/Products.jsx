import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/common/PageHeader";
import TableToolbar from "../components/common/TableToolbar";
import DataTable from "../components/common/DataTable";
import ProductRow from "../components/products/ProductRow";
import ProductStats from "../components/products/ProductStats";
import ProductModal from "../components/products/ProductModal";

import {
    getProducts,
    updateProduct,
    deleteProduct
} from "../api/productApi";

import { getCategories } from "../api/categoryApi";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");

    const [openModal, setOpenModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] =
        useState(false);

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

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getProducts();

            const productData =
                Array.isArray(response)
                    ? response
                    : response?.data ||
                      response?.products ||
                      [];

            setProducts(
                Array.isArray(productData)
                    ? productData
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load products:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            setCategoriesLoading(true);

            const response = await getCategories();

            const categoryData =
                Array.isArray(response)
                    ? response
                    : response?.data || [];

            setCategories(
                Array.isArray(categoryData)
                    ? categoryData
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load categories:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const activeCategories = useMemo(() => {
        return categories.filter(
            (item) =>
                String(item.status || "")
                    .toLowerCase() === "active"
        );
    }, [categories]);

    const filteredProducts = products.filter(
        (product) => {
            const productName =
                product.name || "";

            const barcode =
                product.barcode || "";

            const productCategory =
                product.category_name ||
                product.category ||
                "";

            const quantity = Number(
                product.quantity ??
                product.stock ??
                0
            );

            const minimumStock = Number(
                product.minimum_stock ?? 0
            );

            const backendStatus =
                String(
                    product.status || ""
                ).toLowerCase();

            const productStatus =
                backendStatus === "inactive"
                    ? "Inactive"
                    : quantity <= minimumStock
                        ? "Low Stock"
                        : "Active";

            const searchTerm =
                search.toLowerCase();

            const matchesSearch =
                productName
                    .toLowerCase()
                    .includes(searchTerm) ||
                barcode
                    .toLowerCase()
                    .includes(searchTerm);

            const matchesCategory =
                category === "All" ||
                productCategory === category;

            const matchesStatus =
                status === "All" ||
                productStatus === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );
        }
    );

    // =========================
    // EDIT PRODUCT
    // =========================

    const handleEdit = (product) => {
        setEditingProduct(product);
        setOpenModal(true);
    };

    // =========================
    // DELETE PRODUCT
    // =========================

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(true);
            setError("");

            await deleteProduct(product.id);

            await loadProducts();
        } catch (err) {
            console.error(
                "Failed to delete product:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to delete product."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // =========================
    // CLOSE MODAL
    // =========================

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingProduct(null);
    };

    // =========================
    // AFTER SAVE
    // =========================

    const handleProductSaved = async () => {
        await loadProducts();
    };

    return (
        <>
            <PageHeader
                title="Products"
                subtitle="Manage your inventory products."
                action={
                    <button
                        className="primary-btn"
                        onClick={() => {
                            setEditingProduct(null);
                            setOpenModal(true);
                        }}
                    >
                        Add Product
                    </button>
                }
            />

            <ProductStats
                products={products}
            />

            <TableToolbar
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                status={status}
                setStatus={setStatus}
                categories={activeCategories}
                action={
                    <button
                        className="primary-btn"
                        onClick={() => {
                            setEditingProduct(null);
                            setOpenModal(true);
                        }}
                    >
                        Add Product
                    </button>
                }
            />

            {loading || categoriesLoading ? (
                <div className="loading-state">
                    Loading products...
                </div>
            ) : error ? (
                <div className="error-state">
                    {error}
                </div>
            ) : (
                <>
                    {deleteLoading && (
                        <div className="loading-state">
                            Deleting product...
                        </div>
                    )}

                    <DataTable columns={columns}>
                        {filteredProducts.map(
                            (product) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )
                        )}
                    </DataTable>

                    {filteredProducts.length === 0 && (
                        <div className="empty-state">
                            No products found.
                        </div>
                    )}
                </>
            )}

            <ProductModal
                open={openModal}
                onClose={handleCloseModal}
                onCreated={handleProductSaved}
                product={editingProduct}
                categories={activeCategories}
            />
        </>
    );
}

export default Products;