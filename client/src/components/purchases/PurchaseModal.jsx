import { useState } from "react";

import {
    FiX,
    FiPlus,
    FiTrash2
} from "react-icons/fi";

function PurchaseModal({ open, onClose }) {

    const [items, setItems] = useState([
        {
            id: 1,
            product: "",
            quantity: 1,
            price: 0
        }
    ]);

    if (!open) {
        return null;
    }

    const addItem = () => {

        setItems([
            ...items,
            {
                id: Date.now(),
                product: "",
                quantity: 1,
                price: 0
            }
        ]);

    };

    const removeItem = (id) => {

        if (items.length === 1) {
            return;
        }

        setItems(
            items.filter(
                (item) => item.id !== id
            )
        );
    };

    const updateItem = (
        id,
        field,
        value
    ) => {

        setItems(
            items.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: value
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
                        onClick={onClose}
                    >
                        <FiX />
                    </button>

                </div>

                <div className="modal-body">

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Supplier
                            </label>

                            <select>

                                <option>
                                    Select Supplier
                                </option>

                                <option>
                                    Crown Paints Kenya
                                </option>

                                <option>
                                    Bamburi Cement
                                </option>

                                <option>
                                    Davis & Shirtliff
                                </option>

                                <option>
                                    Kenya Pipe Manufacturers
                                </option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Purchase Date
                            </label>

                            <input
                                type="date"
                                defaultValue="2026-08-07"
                            />

                        </div>

                    </div>

                    <div className="purchase-items-header">

                        <h3>
                            Purchase Items
                        </h3>

                        <button
                            className="secondary-btn"
                            onClick={addItem}
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
                                        value={item.product}
                                        onChange={(e) =>
                                            updateItem(
                                                item.id,
                                                "product",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select Product
                                        </option>

                                        <option>
                                            Crown Paint Premium 4L
                                        </option>

                                        <option>
                                            PVC Pipe 2 Inch
                                        </option>

                                        <option>
                                            Cement 50kg
                                        </option>

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
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Buying Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={item.price}
                                        onChange={(e) =>
                                            updateItem(
                                                item.id,
                                                "price",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="purchase-item-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        KSh{" "}
                                        {(
                                            Number(item.quantity || 0) *
                                            Number(item.price || 0)
                                        ).toLocaleString()}
                                    </strong>

                                </div>

                                <button
                                    className="icon-btn danger"
                                    onClick={() =>
                                        removeItem(item.id)
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
                            KSh {total.toLocaleString()}
                        </strong>

                    </div>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Payment Status
                            </label>

                            <select>

                                <option>
                                    Paid
                                </option>

                                <option>
                                    Partial
                                </option>

                                <option>
                                    Pending
                                </option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Amount Paid
                            </label>

                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                            />

                        </div>

                    </div>

                </div>

                <div className="modal-footer">

                    <button
                        className="secondary-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button className="primary-btn">
                        Save Purchase
                    </button>

                </div>

            </div>

        </div>
    );
}

export default PurchaseModal;