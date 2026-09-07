import { FiShoppingCart } from "react-icons/fi";

import CartItem from "./CartItem";

function Cart({
    items,
    onIncrease,
    onDecrease,
    onRemove
}) {

    return (
        <div className="pos-cart">

            <div className="pos-section-header">

                <div>

                    <h2>
                        Current Sale
                    </h2>

                    <span>
                        {items.length} item
                        {items.length !== 1 ? "s" : ""}
                    </span>

                </div>

                <FiShoppingCart />

            </div>

            {items.length === 0 ? (

                <div className="empty-cart">

                    <FiShoppingCart />

                    <h3>
                        Cart is empty
                    </h3>

                    <p>
                        Select a product to add it to the sale.
                    </p>

                </div>

            ) : (

                <div className="cart-items">

                    {items.map((item) => (

                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={onIncrease}
                            onDecrease={onDecrease}
                            onRemove={onRemove}
                        />

                    ))}

                </div>

            )}

        </div>
    );
}

export default Cart;