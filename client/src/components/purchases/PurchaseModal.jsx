import { useEffect, useState } from "react";

import {
    FiX,
    FiPlus,
    FiTrash2
} from "react-icons/fi";

import {
    getSuppliers
} from "../../api/supplierApi";

import {
    getProducts
} from "../../api/productApi";

import {
    createPurchase
} from "../../api/purchaseApi";

function PurchaseModal({
    open,
    onClose,
    onSaved
}) {

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    const [supplierId, setSupplierId] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [remarks, setRemarks] = useState("");

    const [items, setItems] = useState([
        {
            id: Date.now(),
            productId: "",
            quantity: 1,
            price: 0
        }
    ]);

    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!open) {
            return;
        }

        const loadFormData = async () => {

            try {

                setLoadingData(true);
                setError("");

                const [
                    suppliersResponse,
                    productsResponse
                ] = await Promise.all([
                    getSuppliers(),
                    getProducts()
                ]);

                setSuppliers(
                    suppliersResponse?.data || []
                );

                setProducts(
                    productsResponse?.data || []
                );

            } catch (err) {

                console.error(
                    "Failed to load purchase form data:",
                    err.response?.data || err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load suppliers and products."
                );

            } finally {

                setLoadingData(false);

            }
        };

        loadFormData();

    }, [open]);

    const resetForm = () => {

        setSupplierId("");
        setInvoiceNumber("");
        setRemarks("");

        setItems([
            {
                id: Date.now(),
                productId: "",
                quantity: 1,
                price: 0
            }
        ]);

        setError("");
    };

    const handleClose = () => {

        if (saving) {
            return;
        }

        resetForm();
        onClose();

    };

    const addItem = () => {

        setItems((currentItems) => [
            ...currentItems,
            {
                id: Date.now(),
                productId: "",
                quantity: 1,
                price: 0
            }
        ]);

    };

    const removeItem = (id) => {

        if (items.length === 1) {
            return;
        }

        setItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== id
            )
        );

    };

    const updateItem = (
        id,
        field,
        value
    ) => {

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: value
                    }
                    : item
            )
        );

    };

    const handleProductChange = (
        id,
        productId
    ) => {

        const selectedProduct = products.find(
            (product) =>
                String(product.id) ===
                String(productId)
        );

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        productId,
                        price:
                            selectedProduct?.buying_price ??
                            selectedProduct?.buyingPrice ??
                            0
                    }
                    : item
            )
        );

    };

    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(item.quantity || 0) *
            Number(item.price || 0),
        0
    );

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!supplierId) {

            setError(
                "Please select a supplier."
            );

            return;
        }

        const invalidItem =
            items.some(
                (item) =>
                    !item.productId ||
                    Number(item.quantity) <= 0 ||
                    Number(item.price) < 0
            );

        if (invalidItem) {

            setError(
                "Please complete all purchase items correctly."
            );

            return;
        }

        try {

            setSaving(true);

            const purchaseData = {
                supplier_id: Number(supplierId),

                invoice_number:
                    invoiceNumber.trim() || null,

                remarks:
                    remarks.trim() || null,

                items: items.map((item) => ({
                    product_id: Number(item.productId),
                    quantity: Number(item.quantity),
                    buying_price: Number(item.price)
                }))
            };

            console.log(
                "Creating purchase:",
                purchaseData
            );

            await createPurchase(
                purchaseData
            );

            resetForm();

            if (onSaved) {
                await onSaved();
            }

        } catch (err) {

            console.error(
                "Failed to create purchase:",
                err.response?.data || err
            );

            const validationErrors =
                err.response?.data?.errors;

            if (
                Array.isArray(validationErrors) &&
                validationErrors.length > 0
            ) {

                setError(
                    validationErrors
                        .map((item) => item.msg)
                        .join(" ")
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Failed to create purchase."
                );

            }

        } finally {

            setSaving(false);

        }

    };

    if (!open) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="modal purchase-modal">

                <div className="modal-header">

                    <div>

                        <h2>
                            New Purchase
                        </h2>

                        <p>
                            Record a new stock purchase.
                        </p>

                    </div>

                    <button
                        className="close-btn"
                        onClick={handleClose}
                        disabled={saving}
                    >
                        <FiX />
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="modal-body">

                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}

                        {loadingData ? (

                            <div className="empty-state">
                                Loading suppliers and products...
                            </div>

                        ) : (

                            <>

                                <div className="form-grid">

                                    <div className="form-group">

                                        <label>
                                            Supplier
                                        </label>

                                        <select
                                            value={supplierId}
                                            onChange={(e) =>
                                                setSupplierId(
                                                    e.target.value
                                                )
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select Supplier
                                            </option>

                                            {suppliers.map(
                                                (supplier) => (

                                                    <option
                                                        key={supplier.id}
                                                        value={supplier.id}
                                                    >
                                                        {supplier.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Invoice Number
                                        </label>

                                        <input
                                            type="text"
                                            value={invoiceNumber}
                                            onChange={(e) =>
                                                setInvoiceNumber(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. INV-2003"
                                            disabled={saving}
                                        />

                                    </div>

                                </div>

                                <div className="purchase-items-header">

                                    <h3>
                                        Purchase Items
                                    </h3>

                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={addItem}
                                        disabled={saving}
                                    >
                                        <FiPlus />
                                        Add Item
                                    </button>

                                </div>

                                <div className="purchase-items">

                                    {items.map((item) => (

                                        <div
                                            className="purchase-item"
                                            key={item.id}
                                        >

                                            <div className="form-group">

                                                <label>
                                                    Product
                                                </label>

                                                <select
                                                    value={item.productId}
                                                    onChange={(e) =>
                                                        handleProductChange(
                                                            item.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                >

                                                    <option value="">
                                                        Select Product
                                                    </option>

                                                    {products.map(
                                                        (product) => (

                                                            <option
                                                                key={product.id}
                                                                value={product.id}
                                                            >
                                                                {product.name}
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>

                                            <div className="form-group">

                                                <label>
                                                    Quantity
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                />

                                            </div>

                                            <div className="form-group">

                                                <label>
                                                    Buying Price
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.id,
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                />

                                            </div>

                                            <div className="purchase-item-total">

                                                <span>
                                                    Total
                                                </span>

                                                <strong>
                                                    KSh{" "}
                                                    {(
                                                        Number(
                                                            item.quantity || 0
                                                        ) *
                                                        Number(
                                                            item.price || 0
                                                        )
                                                    ).toLocaleString()}
                                                </strong>

                                            </div>

                                            <button
                                                type="button"
                                                className="icon-btn danger"
                                                onClick={() =>
                                                    removeItem(
                                                        item.id
                                                    )
                                                }
                                                disabled={
                                                    saving ||
                                                    items.length === 1
                                                }
                                            >
                                                <FiTrash2 />
                                            </button>

                                        </div>

                                    ))}

                                </div>

                                <div className="purchase-summary">

                                    <span>
                                        Grand Total
                                    </span>

                                    <strong>
                                        KSh{" "}
                                        {total.toLocaleString()}
                                    </strong>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Remarks
                                    </label>

                                    <textarea
                                        value={remarks}
                                        onChange={(e) =>
                                            setRemarks(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Optional purchase remarks"
                                        rows="3"
                                        disabled={saving}
                                    />

                                </div>

                            </>

                        )}

                    </div>

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={handleClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={
                                saving ||
                                loadingData
                            }
                        >
                            {saving
                                ? "Saving..."
                                : "Save Purchase"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default PurchaseModal;