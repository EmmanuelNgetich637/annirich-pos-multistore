import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";

import POSStats from "../components/pos/POSStats";
import ProductSearch from "../components/pos/ProductSearch";
import Cart from "../components/pos/Cart";
import CheckoutPanel from "../components/pos/CheckoutPanel";

import { getProducts } from "../api/productApi";
import { createSale } from "../api/saleApi";
import {
    initiateMpesaPayment,
    getMpesaTransaction
} from "../api/mpesaApi";

function POS() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [loadingProducts, setLoadingProducts] =
        useState(true);

    const [productError, setProductError] =
        useState("");

    const [saleError, setSaleError] =
        useState("");

    const [refreshStats, setRefreshStats] =
        useState(0);

    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            setProductError("");

            const response = await getProducts();

            setProducts(response.data || []);
        } catch (error) {
            console.error(
                "Failed to load products:",
                error
            );

            setProductError(
                error.response?.data?.message ||
                "Failed to load products."
            );
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const addToCart = (product) => {
        setSaleError("");

        setCart((currentCart) => {
            const existing = currentCart.find(
                (item) =>
                    item.id === product.id
            );

            if (existing) {
                if (
                    existing.quantity >=
                    existing.stock
                ) {
                    return currentCart;
                }

                return currentCart.map(
                    (item) =>
                        item.id === product.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      1
                              }
                            : item
                );
            }

            if (
                Number(product.stock || 0) <= 0
            ) {
                return currentCart;
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    const increaseQuantity = (id) => {
        setSaleError("");

        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                if (
                    item.quantity >=
                    item.stock
                ) {
                    return item;
                }

                return {
                    ...item,
                    quantity:
                        item.quantity + 1
                };
            })
        );
    };

    const decreaseQuantity = (id) => {
        setSaleError("");

        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity -
                                  1
                          }
                        : item
                )
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    };

    const removeFromCart = (id) => {
        setSaleError("");

        setCart((currentCart) =>
            currentCart.filter(
                (item) =>
                    item.id !== id
            )
        );
    };

    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.price || 0) *
                Number(item.quantity || 0),
        0
    );

    /*
     * Wait for the backend callback to
     * confirm the M-Pesa transaction.
     */
    const waitForMpesaPayment = async (
        transactionId
    ) => {
        const maxAttempts = 30;
        const interval = 2000;

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {
            try {
                const response =
                    await getMpesaTransaction(
                        transactionId
                    );

                const transaction =
                    response.data;

                console.log(
                    `M-Pesa transaction status (attempt ${attempt}):`,
                    transaction?.status
                );

                if (
                    transaction?.status ===
                    "completed"
                ) {
                    return transaction;
                }

                if (
                    transaction?.status ===
                        "failed" ||
                    transaction?.status ===
                        "cancelled"
                ) {
                    throw new Error(
                        transaction.result_desc ||
                            "M-Pesa payment failed or was cancelled."
                    );
                }

                /*
                 * Transaction is still pending.
                 */
                if (
                    attempt <
                    maxAttempts
                ) {
                    await new Promise(
                        (resolve) =>
                            setTimeout(
                                resolve,
                                interval
                            )
                    );
                }

            } catch (error) {
                /*
                 * If this is our own payment
                 * failure error, stop polling.
                 */
                if (
                    error.message &&
                    !error.response
                ) {
                    throw error;
                }

                /*
                 * Network/server error.
                 *
                 * Continue polling unless this
                 * was the final attempt.
                 */
                if (
                    attempt >=
                    maxAttempts
                ) {
                    throw new Error(
                        "Unable to confirm the M-Pesa payment. Please check the transaction status before retrying."
                    );
                }

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            interval
                        )
                );
            }
        }

        throw new Error(
            "M-Pesa payment confirmation timed out. Please check the transaction status before retrying."
        );
    };

    /*
     * Create a real sale in the backend.
     */
    const completeSale = async (checkout) => {
        setSaleError("");

        if (cart.length === 0) {
            throw new Error(
                "Your cart is empty."
            );
        }

        const salePayload = {
            items: cart.map((item) => ({
                product_id: item.id,

                quantity: Number(
                    item.quantity
                ),

                selling_price: Number(
                    item.selling_price ??
                    item.price ??
                    0
                )
            })),

            payment_method:
                checkout.paymentMethod ===
                "M-Pesa"
                    ? "Mpesa"
                    : checkout.paymentMethod,

            discount: Number(
                checkout.discount || 0
            )
        };

        try {
            /*
             * STEP 1
             * Create sale.
             */
            const saleResponse =
                await createSale(
                    salePayload
                );

            console.log(
                "Sale created:",
                saleResponse
            );

            const saleData =
                saleResponse.data || {};

            const saleId =
                saleData.saleId ??
                saleData.id ??
                saleData.sale_id;

            if (!saleId) {
                throw new Error(
                    "Sale was created but no sale ID was returned by the server."
                );
            }

            /*
             * STEP 2
             * M-Pesa.
             */
            if (
                checkout.paymentMethod ===
                "M-Pesa"
            ) {
                if (
                    !checkout.phoneNumber
                ) {
                    throw new Error(
                        "M-Pesa phone number is required."
                    );
                }

                const mpesaResponse =
                    await initiateMpesaPayment(
                        {
                            saleId,
                            phoneNumber:
                                checkout.phoneNumber
                        }
                    );

                console.log(
                    "M-Pesa STK response:",
                    mpesaResponse
                );

                const transactionId =
                    mpesaResponse.data
                        ?.transactionId;

                if (!transactionId) {
                    throw new Error(
                        "M-Pesa request was sent but no transaction ID was returned."
                    );
                }

                /*
                 * The STK request was accepted.
                 * Now wait for the callback.
                 */
                const completedTransaction =
                    await waitForMpesaPayment(
                        transactionId
                    );

                console.log(
                    "M-Pesa payment completed:",
                    completedTransaction
                );

                /*
                 * Payment is genuinely complete.
                 */
                setCart([]);

                await loadProducts();

                setRefreshStats(
                    (current) =>
                        current + 1
                );

                return {
                    success: true,

                    saleId,

                    mpesa: true,

                    transaction:
                        completedTransaction
                };
            }

            /*
             * STEP 3
             * Cash/Card.
             */
            setCart([]);

            await loadProducts();

            setRefreshStats(
                (current) =>
                    current + 1
            );

            return {
                success: true,

                saleId,

                mpesa: false
            };

        } catch (error) {
            console.error(
                "Failed to complete sale:",
                error
            );

            const message =
                error.response?.data
                    ?.message ||
                error.response?.data
                    ?.error ||
                error.message ||
                "Failed to complete sale.";

            setSaleError(message);

            throw new Error(message);
        }
    };

    /*
     * Convert backend products into
     * POS structure.
     */
    const posProducts = products
        .filter(
            (product) =>
                product.status ===
                "active"
        )
        .map((product) => ({
            ...product,

            category:
                product.category_name ||
                "Uncategorized",

            barcode:
                product.barcode || "",

            price: Number(
                product.selling_price ??
                    product.sellingPrice ??
                    0
            ),

            stock: Number(
                product.quantity ?? 0
            ),

            selling_price: Number(
                product.selling_price ??
                    product.sellingPrice ??
                    0
            )
        }));

    return (
        <div className="pos-page">

            <PageHeader
                title="Point of Sale"
                subtitle="Create and complete customer sales."
            />

            <POSStats
                refreshKey={
                    refreshStats
                }
            />

            {loadingProducts && (
                <div className="pos-loading">
                    Loading products...
                </div>
            )}

            {productError && (
                <div className="pos-error">
                    {productError}
                </div>
            )}

            {saleError && (
                <div className="pos-error">
                    {saleError}
                </div>
            )}

            <div className="pos-layout">

                <div className="pos-products-section">

                    <ProductSearch
                        products={
                            posProducts
                        }
                        onAdd={
                            addToCart
                        }
                    />

                </div>

                <div className="pos-sale-section">

                    <Cart
                        items={cart}
                        onIncrease={
                            increaseQuantity
                        }
                        onDecrease={
                            decreaseQuantity
                        }
                        onRemove={
                            removeFromCart
                        }
                    />

                    <CheckoutPanel
                        subtotal={
                            subtotal
                        }
                        onComplete={
                            completeSale
                        }
                    />

                </div>

            </div>

        </div>
    );
}

export default POS;