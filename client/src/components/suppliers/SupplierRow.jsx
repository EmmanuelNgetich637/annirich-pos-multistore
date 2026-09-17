import {
    FiEye,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function SupplierRow({
    supplier,
    onView,
    onEdit,
    onDelete
}) {

    return (

        <tr>

            <td>
                <strong>
                    {supplier.name || "—"}
                </strong>
            </td>

            <td>
                {supplier.contact_person || "—"}
            </td>

            <td>
                {supplier.phone || "—"}
            </td>

            <td>
                {supplier.email || "—"}
            </td>

            <td>
                {Number(
                    supplier.purchases ?? 0
                ).toLocaleString()}
            </td>

            <td>
                KSh {Number(
                    supplier.balance ?? 0
                ).toLocaleString()}
            </td>

            <td>
                <StatusBadge
                    status={
                        supplier.status === "active"
                            ? "Active"
                            : "Inactive"
                    }
                />
            </td>

            <td>

                <div className="table-actions">

                    <button
                        className="icon-btn"
                        onClick={() =>
                            onView?.(supplier)
                        }
                        title="View supplier"
                    >
                        <FiEye />
                    </button>

                    <button
                        className="icon-btn"
                        onClick={() =>
                            onEdit?.(supplier)
                        }
                        title="Edit supplier"
                    >
                        <FiEdit2 />
                    </button>

                    <button
                        className="icon-btn danger"
                        onClick={() =>
                            onDelete?.(supplier)
                        }
                        title="Delete supplier"
                    >
                        <FiTrash2 />
                    </button>

                </div>

            </td>

        </tr>

    );
}

export default SupplierRow;
