import { useState } from "react";

import {
    FiCreditCard,
    FiDollarSign,
    FiPhone
} from "react-icons/fi";

function CheckoutPanel({
    subtotal,
    onComplete
}) {
    const [paymentMethod, setPaymentMethod] =
        useState("Cash");

    const [discount, setDiscount] =
        useState(0);

    const [amountPaid, setAmountPaid] =
        useState("");

    const [phoneNumber, setPhoneNumber] =
        useState("");

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    const tax = 0;

    const discountAmount = Math.max(
        0,
        Number(discount || 0)
    );

    const total = Math.max(
        0,
        Number(subtotal || 0) -
            discountAmount +
            tax
    );

    const paidAmount = Number(
        amountPaid || 0
    );

    const change =
        paymentMethod === "Cash"
            ? Math.max(
                  0,
                  paidAmount - total
              )
            : 0;

    const isCashPaymentValid =
        paymentMethod !== "Cash" ||
        paidAmount >= total;

    const isMpesaPhoneValid =
        paymentMethod !== "M-Pesa" ||
        phoneNumber.trim().length > 0;

    const canComplete =
        subtotal > 0 &&
        !processing &&
        isCashPaymentValid &&
        isMpesaPhoneValid;

    const handlePaymentMethodChange = (
        method
    ) => {
        setPaymentMethod(method);
        setError("");

        if (method !== "Cash") {
            setAmountPaid("");
        }
    };

    const handleCompleteSale = async () => {
        setError("");

        if (subtotal <= 0) {
            setError(
                "Add at least one product to the sale."
            );
            return;
        }

        if (
            paymentMethod === "Cash" &&
            paidAmount < total
        ) {
            setError(
                "Amount paid is less than the sale total."
            );
            return;
        }

        if (
            paymentMethod === "M-Pesa" &&
            !phoneNumber.trim()
        ) {
            setError(
                "Enter the customer's M-Pesa phone number."
            );
            return;
        }

        try {
            setProcessing(true);

            await onComplete({
                paymentMethod,
                total,
                discount: discountAmount,
                amountPaid:
                    paymentMethod === "Cash"
                        ? paidAmount
                        : 0,
                change,
                phoneNumber:
                    paymentMethod === "M-Pesa"
                        ? phoneNumber.trim()
                        : null
            });
        } catch (error) {
            console.error(
                "Checkout failed:",
                error
            );

            setError(
                error?.message ||
                    "Unable to complete the sale."
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="checkout-panel">

            {/* SUMMARY */}
            <div className="checkout-summary">

                <div>
                    <span>
                        Subtotal
                    </span>

                    <strong>
                        KSh{" "}
                        {Number(
                            subtotal || 0
                        ).toLocaleString()}
                    </strong>
                </div>

                <div>
                    <span>
                        Discount
                    </span>

                    <input
                        type="number"
                        min="0"
                        max={subtotal}
                        value={discount}
                        onChange={(e) =>
                            setDiscount(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div>
                    <span>
                        Tax
                    </span>

                    <strong>
                        KSh{" "}
                        {tax.toLocaleString()}
                    </strong>
                </div>

                <div className="checkout-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        KSh{" "}
                        {total.toLocaleString()}
                    </strong>

                </div>

            </div>

            {/* PAYMENT METHOD */}
            <div className="payment-method">

                <label>
                    Payment Method
                </label>

                <div className="payment-options">

                    <button
                        type="button"
                        className={
                            paymentMethod === "Cash"
                                ? "payment-option active"
                                : "payment-option"
                        }
                        onClick={() =>
                            handlePaymentMethodChange(
                                "Cash"
                            )
                        }
                        disabled={processing}
                    >
                        <FiDollarSign />

                        Cash
                    </button>

                    <button
                        type="button"
                        className={
                            paymentMethod === "M-Pesa"
                                ? "payment-option active"
                                : "payment-option"
                        }
                        onClick={() =>
                            handlePaymentMethodChange(
                                "M-Pesa"
                            )
                        }
                        disabled={processing}
                    >
                        M-Pesa
                    </button>

                    <button
                        type="button"
                        className={
                            paymentMethod === "Card"
                                ? "payment-option active"
                                : "payment-option"
                        }
                        onClick={() =>
                            handlePaymentMethodChange(
                                "Card"
                            )
                        }
                        disabled={processing}
                    >
                        <FiCreditCard />

                        Card
                    </button>

                </div>

            </div>

            {/* CASH */}
            {paymentMethod === "Cash" && (
                <>
                    <div className="amount-paid">

                        <label>
                            Amount Paid
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="Enter amount paid"
                            value={amountPaid}
                            onChange={(e) =>
                                setAmountPaid(
                                    e.target.value
                                )
                            }
                            disabled={processing}
                        />

                    </div>

                    <div className="change-row">

                        <span>
                            Change
                        </span>

                        <strong>
                            KSh{" "}
                            {change.toLocaleString()}
                        </strong>

                    </div>
                </>
            )}

            {/* M-PESA */}
            {paymentMethod === "M-Pesa" && (
                <div className="amount-paid">

                    <label>
                        M-Pesa Phone Number
                    </label>

                    <div className="mpesa-phone-input">

                        <FiPhone />

                        <input
                            type="tel"
                            placeholder="0712345678"
                            value={phoneNumber}
                            onChange={(e) =>
                                setPhoneNumber(
                                    e.target.value
                                )
                            }
                            disabled={processing}
                        />

                    </div>

                    <small>
                        An M-Pesa payment prompt
                        will be sent to this number.
                    </small>

                </div>
            )}

            {/* CARD */}
            {paymentMethod === "Card" && (
                <div className="card-payment-info">

                    <p>
                        Card payment integration
                        will be connected here.
                    </p>

                    <small>
                        The sale will not be submitted
                        until a card payment provider
                        is connected.
                    </small>

                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="checkout-error">
                    {error}
                </div>
            )}

            {/* COMPLETE SALE */}
            <button
                type="button"
                className="complete-sale-btn"
                disabled={!canComplete}
                onClick={handleCompleteSale}
            >
                {processing
                    ? "Processing..."
                    : paymentMethod === "M-Pesa"
                    ? "Send M-Pesa Request"
                    : "Complete Sale"}
            </button>

        </div>
    );
}

export default CheckoutPanel;