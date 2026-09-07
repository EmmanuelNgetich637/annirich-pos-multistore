import { useState } from "react";

import PageHeader from "../components/common/PageHeader";

import POSStats from "../components/pos/POSStats";
import ProductSearch from "../components/pos/ProductSearch";
import Cart from "../components/pos/Cart";
import CheckoutPanel from "../components/pos/CheckoutPanel";

import posProducts from "../data/posProducts";

function POS() {

    const [cart, setCart] = useState([]);

    const addToCart = (product) => {

        setCart((currentCart) => {

            const existing =
                currentCart.find(
                    (item) =>
                        item.id === product.id
                );

            if (existing) {

                return currentCart.map(
                    (item) =>
                        item.id === product.id
                            ? {
                                ...item,
                                quantity:
                                    item.quantity + 1
                            }
                            : item
                );
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

        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity:
                            item.quantity + 1
                    }
                    : item
            )
        );
    };

    const decreaseQuantity = (id) => {

        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1
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
            item.price * item.quantity,
        0
    );

    const completeSale = (sale) => {

        console.log(
            "UI sale completed:",
            {
                items: cart,
                ...sale
            }
        );

        setCart([]);
    };

    return (
        <div className="pos-page">

            <PageHeader
                title="Point of Sale"
                subtitle="Create and complete customer sales."
            />

            <POSStats />

            <div className="pos-layout">

                <div className="pos-products-section">

                    <ProductSearch
                        products={posProducts}
                        onAdd={addToCart}
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
                        subtotal={subtotal}
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