import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
    getPurchase,
    cancelPurchase
} from "../../api/purchaseApi";

function PurchaseDetailsModal({
    open,
    purchase,
    onClose,
    onUpdated
}) {

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadPurchase = async () => {

        if (!purchase?.id) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response =
                await getPurchase(purchase.id);

            setDetails(
                response?.data || null
            );

        } catch (err) {

            console.error(
                "Failed to load purchase details:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load purchase details."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        if (!open || !purchase?.id) {
            return;
        }

        setDetails(null);
        setError("");
        setSuccess("");

        loadPurchase();

    }, [open, purchase?.id]);

    if (!open) {
        return null;
    }

    const items = details?.items || [];

    const totalAmount = Number(
        details?.total_amount || 0
    );

    const purchaseDate = details?.purchase_date
        ? new Date(
            details.purchase_date
        ).toLocaleString()
        : "—";

    const status =
        details?.status || purchase?.status || "—";

    const canCancel =
        status === "Completed" &&
        !cancelling;

    const handleCancel = async () => {

        if (!details?.id) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel this purchase?\n\n" +
            "This will reverse the stock received from this purchase."
        );

        if (!confirmed) {
            return;
        }

        try {

            setCancelling(true);
            setError("");
            setSuccess("");

            const response =
                await cancelPurchase(details.id);

            setSuccess(
                response?.message ||
                "Purchase cancelled successfully."
            );

            await loadPurchase();

            if (onUpdated) {
                await onUpdated();
            }

        } catch (err) {

            console.error(
                "Failed to cancel purchase:",
                err.response?.data || err
            );

            setError(
                err.response?.data?.message ||
                "Failed to cancel purchase."
            );

        } finally {

            setCancelling(false);

        }
    };

    return (
        <div className="modal-overlay">

            <div className="modal purchase-details-modal">

                <div className="modal-header">

                    <div>

                        <h2>
                            Purchase Details
                        </h2>

                        <p>
                            {details?.invoice_number ||
                                `PUR-${details?.id || purchase?.id}`}
                        </p>

                    </div>

                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={cancelling}
                    >
                        <FiX />
                    </button>

                </div>

                <div className="modal-body">

                    {loading && (
                        <div className="empty-state">
                            Loading purchase details...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    {!loading && success && (
                        <div className="form-success">
                            {success}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        details && (
                            <>

                                <div className="form-grid">

                                    <div className="form-group">

                                        <label>
                                            Supplier
                                        </label>

                                        <div>
                                            {details.supplier_name ||
                                                "—"}
                                        </div>

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Invoice Number
                                        </label>

                                        <div>
                                            {details.invoice_number ||
                                                `PUR-${details.id}`}
                                        </div>

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Purchase Date
                                        </label>

                                        <div>
                                            {purchaseDate}
                                        </div>

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Status
                                        </label>

                                        <div>
                                            {status}
                                        </div>

                                    </div>

                                </div>

                                <div className="purchase-items-header">

                                    <h3>
                                        Purchase Items
                                    </h3>

                                </div>

                                {items.length === 0 ? (

                                    <div className="empty-state">
                                        No purchase items found.
                                    </div>

                                ) : (

                                    <div className="purchase-items">

                                        {items.map((item) => {

                                            const quantity =
                                                Number(
                                                    item.quantity || 0
                                                );

                                            const buyingPrice =
                                                Number(
                                                    item.buying_price || 0
                                                );

                                            const subtotal =
                                                Number(
                                                    item.subtotal ??
                                                    quantity *
                                                    buyingPrice
                                                );

                                            return (
                                                <div
                                                    className="purchase-item"
                                                    key={item.id}
                                                >

                                                    <div className="form-group">

                                                        <label>
                                                            Product
                                                        </label>

                                                        <div>
                                                            {item.product_name ||
                                                                "—"}
                                                        </div>

                                                    </div>

                                                    <div className="form-group">

                                                        <label>
                                                            Quantity
                                                        </label>

                                                        <div>
                                                            {quantity}
                                                        </div>

                                                    </div>

                                                    <div className="form-group">

                                                        <label>
                                                            Buying Price
                                                        </label>

                                                        <div>
                                                            KSh{" "}
                                                            {buyingPrice.toLocaleString()}
                                                        </div>

                                                    </div>

                                                    <div className="purchase-item-total">

                                                        <span>
                                                            Subtotal
                                                        </span>

                                                        <strong>
                                                            KSh{" "}
                                                            {subtotal.toLocaleString()}
                                                        </strong>

                                                    </div>

                                                </div>
                                            );

                                        })}

                                    </div>

                                )}

                                <div className="purchase-total">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        KSh{" "}
                                        {totalAmount.toLocaleString()}
                                    </strong>

                                </div>

                                {details.remarks && (
                                    <div className="form-group">

                                        <label>
                                            Remarks
                                        </label>

                                        <div>
                                            {details.remarks}
                                        </div>

                                    </div>
                                )}

                            </>
                        )}

                </div>

                <div className="modal-footer">

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onClose}
                        disabled={cancelling}
                    >
                        Close
                    </button>

                    {canCancel && (
                        <button
                            type="button"
                            className="btn-danger"
                            onClick={handleCancel}
                        >
                            {cancelling
                                ? "Cancelling..."
                                : "Cancel Purchase"}
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}

export default PurchaseDetailsModal;
