import {
    FiEdit2,
    FiTrash2,
    FiEye
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function CategoryRow({
    category,
    onEdit,
    onDelete,
    onView
}) {

    const productCount =
        Number(category.product_count || 0);

    const status =
        String(category.status || "")
            .toLowerCase();

    return (
        <tr>

            <td>
                <strong>
                    {category.name || "—"}
                </strong>
            </td>

            <td>
                {category.description || "—"}
            </td>

            <td>
                {productCount.toLocaleString()}
            </td>

            <td>
                <StatusBadge
                    status={status}
                />
            </td>

            <td>

                <div className="table-actions">

                    <button
                        className="icon-btn"
                        onClick={() =>
                            onView?.(category)
                        }
                        title="View category"
                    >
                        <FiEye />
                    </button>

                    <button
                        className="icon-btn"
                        onClick={() =>
                            onEdit?.(category)
                        }
                        title="Edit category"
                    >
                        <FiEdit2 />
                    </button>

                    <button
                        className="icon-btn danger"
                        onClick={() =>
                            onDelete?.(category)
                        }
                        title="Delete category"
                    >
                        <FiTrash2 />
                    </button>

                </div>

            </td>

        </tr>
    );
}

export default CategoryRow;