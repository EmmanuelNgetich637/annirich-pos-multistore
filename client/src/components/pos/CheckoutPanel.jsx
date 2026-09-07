import { useState } from "react";

import {
    FiCreditCard,
    FiDollarSign
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

    const tax = 0;

    const total =
        Math.max(
            0,
            subtotal - Number(discount || 0) + tax
        );

    const change =
        Math.max(
            0,
            Number(amountPaid || 0) - total
        );

    return (
        <div className="checkout-panel">

            <div className="checkout-summary">

                <div>
                    <span>
                        Subtotal
                    </span>

                    <strong>
                        KSh {subtotal.toLocaleString()}
                    </strong>
                </div>

                <div>
                    <span>
                        Discount
                    </span>

                    <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) =>
                            setDiscount(e.target.value)
                        }
                    />
                </div>

                <div>
                    <span>
                        Tax
                    </span>

                    <strong>
                        KSh {tax.toLocaleString()}
                    </strong>
                </div>

                <div className="checkout-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        KSh {total.toLocaleString()}
                    </strong>

                </div>

            </div>

            <div className="payment-method">

                <label>
                    Payment Method
                </label>

                <div className="payment-options">

                    <button
                        className={
                            paymentMethod === "Cash"
                                ? "payment-option active"
                                : "payment-option"
                        }
                        onClick={() =>
                            setPaymentMethod("Cash")
                        }
                    >
                        <FiDollarSign />
                        Cash
                    </button>

                    <button
                        className={
                            paymentMethod === "M-Pesa"
                                ? "payment-option active"
                                : "payment-option"
                        }
                        onClick={() =>
                            setPaymentMethod("M-Pesa")
                        }
                    >
                        M-Pesa
                    </button>

                    <button
                        className={
                            paymentMethod === "Card"
                                ? "payment-option active"
                                : "payment-option"
                        }
                        onClick={() =>
                            setPaymentMethod("Card")
                        }
                    >
                        <FiCreditCard />
                        Card
                    </button>

                </div>

            </div>

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
                        setAmountPaid(e.target.value)
                    }
                />

            </div>

            <div className="change-row">

                <span>
                    Change
                </span>

                <strong>
                    KSh {change.toLocaleString()}
                </strong>

            </div>

            <button
                className="complete-sale-btn"
                disabled={subtotal === 0}
                onClick={() =>
                    onComplete({
                        paymentMethod,
                        total,
                        amountPaid
                    })
                }
            >
                Complete Sale
            </button>

        </div>
    );
}

export default CheckoutPanel;