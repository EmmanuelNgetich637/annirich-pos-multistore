import {
    FiEye
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function PurchaseRow({ purchase, onView }) {

    const total = Number(
        purchase.total_amount || 0
    );

    const date = purchase.purchase_date
        ? new Date(
            purchase.purchase_date
        ).toLocaleDateString()
        : "—";

    return (
        <tr>

            <td>
                <strong>
                    {purchase.invoice_number || `PUR-${purchase.id}`}
                </strong>
            </td>

            <td>
                {purchase.supplier_name || "—"}
            </td>

            <td>
                {date}
            </td>

            <td>
                {purchase.items_count ?? "—"}
            </td>

            <td>
                KSh {total.toLocaleString()}
            </td>

            <td>
                <StatusBadge
                    status={purchase.status}
                />
            </td>

            <td>

                <div className="table-actions">

                    <button
                        className="icon-btn"
                        title="View purchase"
                        onClick={() => onView?.(purchase)}
                    >
                        <FiEye />
                    </button>

                </div>

            </td>

        </tr>
    );
}

export default PurchaseRow;
