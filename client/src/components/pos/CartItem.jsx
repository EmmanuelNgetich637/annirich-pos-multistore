import {
    FiMinus,
    FiPlus,
    FiTrash2
} from "react-icons/fi";

function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove
}) {
    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 0);

    const total = price * quantity;

    const stock = Number(item.stock || 0);

    const canIncrease = quantity < stock;

    return (
        <div className="cart-item">

            <div className="cart-item-details">

                <strong>
                    {item.name}
                </strong>

                <span>
                    KSh {price.toLocaleString()} each
                </span>

            </div>

            <div className="cart-item-controls">

                <button
                    type="button"
                    onClick={() =>
                        onDecrease(item.id)
                    }
                    aria-label={`Decrease ${item.name} quantity`}
                >
                    <FiMinus />
                </button>

                <span>
                    {quantity}
                </span>

                <button
                    type="button"
                    onClick={() =>
                        onIncrease(item.id)
                    }
                    disabled={!canIncrease}
                    aria-label={`Increase ${item.name} quantity`}
                >
                    <FiPlus />
                </button>

            </div>

            <strong className="cart-item-total">
                KSh {total.toLocaleString()}
            </strong>

            <button
                type="button"
                className="cart-remove"
                onClick={() =>
                    onRemove(item.id)
                }
                aria-label={`Remove ${item.name} from cart`}
            >
                <FiTrash2 />
            </button>

        </div>
    );
}

export default CartItem;