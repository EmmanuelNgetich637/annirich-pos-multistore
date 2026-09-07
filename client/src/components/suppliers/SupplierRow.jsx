import {
    FiEye,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function SupplierRow({ supplier }) {

    return (
        <tr>

            <td>
                <strong>
                    {supplier.name}
                </strong>
            </td>

            <td>
                {supplier.contactPerson}
            </td>

            <td>
                {supplier.phone}
            </td>

            <td>
                {supplier.email}
            </td>

            <td>
                {supplier.purchases}
            </td>

            <td>
                KSh {supplier.balance.toLocaleString()}
            </td>

            <td>
                <StatusBadge
                    status={supplier.status}
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

export default SupplierRow;