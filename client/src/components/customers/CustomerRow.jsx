import {
    FiEye,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function CustomerRow({ customer }) {

    return (
        <tr>

            <td>
                <strong>
                    {customer.name}
                </strong>
            </td>

            <td>
                {customer.phone}
            </td>

            <td>
                {customer.email}
            </td>

            <td>
                {customer.purchases}
            </td>

            <td>
                KSh {customer.totalSpent.toLocaleString()}
            </td>

            <td>
                KSh {customer.balance.toLocaleString()}
            </td>

            <td>
                <StatusBadge
                    status={customer.status}
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

export default CustomerRow;