import {
    FiEye,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";


function CustomerRow({
    customer,
    onView,
    onEdit,
    onDelete
}) {

    const purchases =
        Number(customer.purchases ?? 0);

    const totalSpent =
        Number(customer.totalSpent ?? 0);

    const balance =
        Number(customer.balance ?? 0);


    return (
        <tr>

            <td>
                <strong>
                    {customer.name || "—"}
                </strong>
            </td>

            <td>
                {customer.phone || "—"}
            </td>

            <td>
                {customer.email || "—"}
            </td>

            <td>
                {purchases.toLocaleString()}
            </td>

            <td>
                KSh {totalSpent.toLocaleString()}
            </td>

            <td>
                KSh {balance.toLocaleString()}
            </td>

            <td>
                <StatusBadge
                    status={
                        customer.status === "active"
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
                            onView?.(customer)
                        }
                        title="View customer"
                    >
                        <FiEye />
                    </button>

                    <button
                        className="icon-btn"
                        onClick={() =>
                            onEdit?.(customer)
                        }
                        title="Edit customer"
                    >
                        <FiEdit2 />
                    </button>

                    <button
                        className="icon-btn danger"
                        onClick={() =>
                            onDelete?.(customer)
                        }
                        title="Delete customer"
                    >
                        <FiTrash2 />
                    </button>

                </div>

            </td>

        </tr>
    );
}


export default CustomerRow;
