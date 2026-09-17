import {
    FiEye,
    FiMoreVertical
} from "react-icons/fi";

function SalesTable({ sales, onView }) {

    const getStatusClass = (status) => {

        switch (status) {

            case "Completed":
                return "status-badge completed";

            case "Pending":
                return "status-badge pending";

            case "Failed":
                return "status-badge cancelled";

            case "Cancelled":
                return "status-badge cancelled";

            default:
                return "status-badge pending";
        }
    };

    return (
        <div className="sales-table-container">

            <table className="sales-table">

                <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Customer</th>
                        <th>Cashier</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Payment</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>

                    {sales.map((sale) => (

                        <tr key={sale.id}>

                            <td>
                                <strong className="invoice-number">
                                    {sale.invoice}
                                </strong>
                            </td>

                            <td>
                                {sale.customer}
                            </td>

                            <td>
                                {sale.cashier}
                            </td>

                            <td>
                                <div className="sale-date">

                                    <strong>
                                        {sale.date}
                                    </strong>

                                    <span>
                                        {sale.time}
                                    </span>

                                </div>
                            </td>

                            <td>
                                {sale.items}
                            </td>

                            <td>
                                <span
                                    className={`payment-badge ${String(
                                        sale.paymentMethod
                                    )
                                        .toLowerCase()
                                        .replace("-", "")}`}
                                >
                                    {sale.paymentMethod}
                                </span>
                            </td>

                            <td>
                                <strong>
                                    KSh{" "}
                                    {Number(
                                        sale.total || 0
                                    ).toLocaleString()}
                                </strong>
                            </td>

                            <td>
                                <span
                                    className={getStatusClass(
                                        sale.status
                                    )}
                                >
                                    {sale.status}
                                </span>
                            </td>

                            <td>

                                <div className="sale-actions">

                                    <button
                                        title="View sale"
                                        onClick={() =>
                                            onView(sale)
                                        }
                                    >
                                        <FiEye />
                                    </button>

                                    <button title="More">
                                        <FiMoreVertical />
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {sales.length === 0 && (
                <div className="sales-empty">
                    No sales found.
                </div>
            )}

        </div>
    );
}

export default SalesTable;
