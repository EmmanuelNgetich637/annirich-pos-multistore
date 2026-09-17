import { useEffect, useState } from "react";

import PageHeader from "../components/common/PageHeader";

import POSStats from "../components/pos/POSStats";
import ProductSearch from "../components/pos/ProductSearch";
import Cart from "../components/pos/Cart";
import CheckoutPanel from "../components/pos/CheckoutPanel";

import { getProducts } from "../api/productApi";

function POS() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoadingProducts(true);
                setProductError("");

                const response = await getProducts();

                setProducts(response.data || []);
            } catch (error) {
                console.error("Failed to load products:", error);

                setProductError(
                    error.response?.data?.message ||
                    "Failed to load products."
                );
            } finally {
                setLoadingProducts(false);
            }
        };

        loadProducts();
    }, []);

    const addToCart = (product) => {
        setCart((currentCart) => {
            const existing = currentCart.find(
                (item) => item.id === product.id
            );

            if (existing) {
                if (existing.quantity >= existing.stock) {
                    return currentCart;
                }

                return currentCart.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                          }
                        : item
                );
            }

            if (Number(product.stock) <= 0) {
                return currentCart;
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    };

    const increaseQuantity = (id) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                if (item.quantity >= item.stock) {
                    return item;
                }

                return {
                    ...item,
                    quantity: item.quantity + 1,
                };
            })
        );
    };

    const decreaseQuantity = (id) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              quantity: item.quantity - 1,
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item.id !== id)
        );
    };

    const subtotal = cart.reduce(
        (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );

    const completeSale = (sale) => {
        console.log("POS sale:", {
            items: cart,
            ...sale,
        });

        setCart([]);
    };

    /*
     * Convert the backend product structure into the structure
     * expected by the POS components.
     */
    const posProducts = products
        .filter((product) => product.status === "active")
        .map((product) => ({
            ...product,

            category: product.category_name || "Uncategorized",

            barcode: product.barcode || "",

            price: Number(product.selling_price ?? 0),

            stock: Number(product.quantity ?? 0),

            selling_price: Number(product.selling_price ?? 0),
        }));

    return (
        <div className="pos-page">
            <PageHeader
                title="Point of Sale"
                subtitle="Create and complete customer sales."
            />

            <POSStats />

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
                        onIncrease={increaseQuantity}
                        onDecrease={decreaseQuantity}
                        onRemove={removeFromCart}
                    />

                    <CheckoutPanel
                        subtotal={subtotal}
                        onComplete={completeSale}
                    />
                </div>
            </div>
        </div>
    );
}

export default POS;