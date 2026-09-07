import {
    FiEye,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function PurchaseRow({ purchase }) {

    return (
        <tr>

            <td>
                <strong>
                    {purchase.reference}
                </strong>
            </td>

            <td>
                {purchase.supplier}
            </td>

            <td>
                {purchase.date}
            </td>

            <td>
                {purchase.items}
            </td>

            <td>
                KSh {purchase.total.toLocaleString()}
            </td>

            <td>
                KSh {purchase.paid.toLocaleString()}
            </td>

            <td>
                KSh {purchase.balance.toLocaleString()}
            </td>

            <td>
                <StatusBadge
                    status={purchase.status}
                />
            </td>

            <td>

                <div className="table-actions">

                    <button className="icon-btn">
                        <FiEye />
                    </button>

                    <button className="icon-btn">
                        <FiEdit2 />
                    </button>

                    <button className="icon-btn danger">
                        <FiTrash2 />
                    </button>

                </div>

            </td>

        </tr>
    );
}

export default PurchaseRow;