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

    const total =
        item.price * item.quantity;

    return (
        <div className="cart-item">

            <div className="cart-item-details">

                <strong>
                    {item.name}
                </strong>

                <span>
                    KSh {item.price.toLocaleString()} each
                </span>

            </div>

            <div className="cart-item-controls">

                <button
                    onClick={() =>
                        onDecrease(item.id)
                    }
                >
                    <FiMinus />
                </button>

                <span>
                    {item.quantity}
                </span>

                <button
                    onClick={() =>
                        onIncrease(item.id)
                    }
                >
                    <FiPlus />
                </button>

            </div>

            <strong className="cart-item-total">
                KSh {total.toLocaleString()}
            </strong>

            <button
                className="cart-remove"
                onClick={() =>
                    onRemove(item.id)
                }
            >
                <FiTrash2 />
            </button>

        </div>
    );
}

export default CartItem;