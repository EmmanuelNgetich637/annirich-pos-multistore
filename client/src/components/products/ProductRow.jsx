import {
    FiEdit2,
    FiTrash2,
    FiEye
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function ProductRow({
    product,
    onEdit,
    onDelete,
    onView
}) {
    const buyingPrice = Number(
        product.buying_price ??
        product.buyingPrice ??
        0
    );

    const sellingPrice = Number(
        product.selling_price ??
        product.sellingPrice ??
        0
    );

    const quantity = Number(
        product.quantity ??
        product.stock ??
        0
    );

    const minimumStock = Number(
        product.minimum_stock ??
        0
    );

    const category =
        product.category_name ||
        product.category ||
        "—";

    const status =
        product.status ||
        (
            quantity <= minimumStock
                ? "Low Stock"
                : "Active"
        );

    return (
        <tr>
            <td>
                {product.barcode || "—"}
            </td>

            <td>
                {product.name || "—"}
            </td>

            <td>
                {category}
            </td>

            <td>
                KES {buyingPrice.toLocaleString()}
            </td>

            <td>
                KES {sellingPrice.toLocaleString()}
            </td>

            <td>
                {quantity.toLocaleString()}
            </td>

            <td>
                <StatusBadge status={status} />
            </td>

            <td>
                <div className="table-actions">

                    <button
                        className="icon-btn"
                        onClick={() => onView?.(product)}
                        title="View product"
                    >
                        <FiEye />
                    </button>

                    <button
                        className="icon-btn"
                        onClick={() => onEdit?.(product)}
                        title="Edit product"
                    >
                        <FiEdit2 />
                    </button>

                    <button
                        className="icon-btn danger"
                        onClick={() => onDelete?.(product)}
                        title="Delete product"
                    >
                        <FiTrash2 />
                    </button>

                </div>
            </td>
        </tr>
    );
}

export default ProductRow;