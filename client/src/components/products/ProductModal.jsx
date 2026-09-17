import { useEffect, useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";

import {
    createProduct,
    updateProduct
} from "../../api/productApi";

const emptyForm = {
    name: "",
    barcode: "",
    category_id: "",
    buying_price: "",
    selling_price: "",
    quantity: "",
    minimum_stock: "5",
    unit: "pcs",
    description: ""
};

function ProductModal({
    open,
    onClose,
    onCreated,
    product = null,
    categories = []
}) {
    const isEditing = Boolean(product);

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!open) {
            setForm(emptyForm);
            setError("");
            setSuccess("");
            return;
        }

        if (product) {
            setForm({
                name: product.name ?? "",
                barcode: product.barcode ?? "",
                category_id: product.category_id
                    ? String(product.category_id)
                    : "",
                buying_price: product.buying_price ?? "",
                selling_price: product.selling_price ?? "",
                quantity: product.quantity ?? "",
                minimum_stock:
                    product.minimum_stock ?? "5",
                unit: product.unit ?? "pcs",
                description: product.description ?? ""
            });
        } else {
            setForm(emptyForm);
        }

        setError("");
        setSuccess("");
    }, [open, product]);

    if (!open) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!form.category_id) {
            setError("Category is required.");
            return;
        }

        if (
            form.buying_price === "" ||
            Number(form.buying_price) < 0
        ) {
            setError("Enter a valid buying price.");
            return;
        }

        if (
            form.selling_price === "" ||
            Number(form.selling_price) < 0
        ) {
            setError("Enter a valid selling price.");
            return;
        }

        if (
            form.quantity === "" ||
            Number(form.quantity) < 0 ||
            !Number.isInteger(Number(form.quantity))
        ) {
            setError("Quantity must be a whole number.");
            return;
        }

        if (
            form.minimum_stock === "" ||
            Number(form.minimum_stock) < 0 ||
            !Number.isInteger(Number(form.minimum_stock))
        ) {
            setError("Minimum stock must be a whole number.");
            return;
        }

        const productData = {
            name: form.name.trim(),
            barcode: form.barcode.trim() || null,
            category_id: Number(form.category_id),
            buying_price: Number(form.buying_price),
            selling_price: Number(form.selling_price),
            quantity: Number(form.quantity),
            minimum_stock: Number(form.minimum_stock),
            unit: form.unit.trim() || "pcs",
            description: form.description.trim() || null
        };

        try {
            setLoading(true);

            if (isEditing) {
                await updateProduct(
                    product.id,
                    productData
                );

                setSuccess(
                    "Product updated successfully."
                );
            } else {
                await createProduct(productData);

                setSuccess(
                    "Product created successfully."
                );
            }

            if (onCreated) {
                await onCreated();
            }

            setTimeout(() => {
                onClose();
            }, 500);

        } catch (err) {
            console.error(
                isEditing
                    ? "Failed to update product:"
                    : "Failed to create product:",
                err
            );

            const validationErrors =
                err?.response?.data?.errors;

            if (Array.isArray(validationErrors)) {
                setError(
                    validationErrors
                        .map((item) => item.msg)
                        .join(", ")
                );
            } else {
                setError(
                    err?.response?.data?.message ||
                    (
                        isEditing
                            ? "Failed to update product."
                            : "Failed to create product."
                    )
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <div>
                        <h2>
                            {isEditing
                                ? "Edit Product"
                                : "Add Product"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update product information."
                                : "Add a new product to your inventory."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <FiX />
                    </button>

                </div>

                <form
                    className="modal-form"
                    onSubmit={handleSubmit}
                >

                    <div className="modal-body">

                        {error && (
                            <div className="error-state">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-state">
                                {success}
                            </div>
                        )}

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. 2.5mm Cable"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Barcode
                                </label>

                                <input
                                    type="text"
                                    name="barcode"
                                    value={form.barcode}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Category
                                </label>

                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleChange}
                                    disabled={
                                        loading ||
                                        categories.length === 0
                                    }
                                    required
                                >
                                    <option value="">
                                        {categories.length === 0
                                            ? "No active categories available"
                                            : "Select category"}
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Buying Price
                                </label>

                                <input
                                    type="number"
                                    name="buying_price"
                                    value={form.buying_price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Selling Price
                                </label>

                                <input
                                    type="number"
                                    name="selling_price"
                                    value={form.selling_price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Stock Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="1"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Minimum Stock
                                </label>

                                <input
                                    type="number"
                                    name="minimum_stock"
                                    value={form.minimum_stock}
                                    onChange={handleChange}
                                    placeholder="5"
                                    min="0"
                                    step="1"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Unit
                                </label>

                                <input
                                    type="text"
                                    name="unit"
                                    value={form.unit}
                                    onChange={handleChange}
                                    placeholder="pcs"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Optional product description"
                                    disabled={loading}
                                    rows="3"
                                />
                            </div>

                        </div>

                        <div className="upload-box">

                            <FiUpload size={40} />

                            <p>
                                Product image upload can be
                                connected after the core product
                                workflow is complete.
                            </p>

                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={
                                loading ||
                                categories.length === 0
                            }
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Update Product"
                                    : "Save Product"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ProductModal;
