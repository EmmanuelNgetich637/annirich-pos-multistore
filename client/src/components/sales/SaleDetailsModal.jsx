import {
    FiX,
    FiPrinter
} from "react-icons/fi";


function SaleDetailsModal({
    sale,
    onClose
}) {

    if (!sale) {
        return null;
    }


    return (

        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="sale-details-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="sale-modal-header">

                    <div>

                        <span>
                            Sale Details
                        </span>

                        <h2>
                            {sale.invoice}
                        </h2>

                    </div>


                    <button
                        onClick={onClose}
                    >
                        <FiX />
                    </button>

                </div>


                <div className="sale-details-grid">

                    <div>
                        <span>
                            Customer
                        </span>

                        <strong>
                            {sale.customer}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Cashier
                        </span>

                        <strong>
                            {sale.cashier}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Date
                        </span>

                        <strong>
                            {sale.date} · {sale.time}
                        </strong>
                    </div>


                    <div>
                        <span>
                            Payment
                        </span>

                        <strong>
                            {sale.paymentMethod}
                        </strong>
                    </div>

                </div>


                {Array.isArray(sale.items) &&
                    sale.items.length > 0 && (

                    <div className="sale-items-section">

                        <h3>
                            Items
                        </h3>


                        <div className="sale-items-table">

                            <div className="sale-item-header">

                                <span>
                                    Product
                                </span>

                                <span>
                                    Qty
                                </span>

                                <span>
                                    Price
                                </span>

                                <span>
                                    Total
                                </span>

                            </div>


                            {sale.items.map(
                                (item) => (

                                <div
                                    className="sale-item-row"
                                    key={item.id}
                                >

                                    <span>
                                        {item.productName}
                                    </span>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <span>
                                        KSh{" "}
                                        {item.sellingPrice
                                            .toLocaleString()}
                                    </span>

                                    <span>
                                        KSh{" "}
                                        {item.subtotal
                                            .toLocaleString()}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                )}


                <div className="sale-detail-summary">

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            KSh{" "}
                            {sale.subtotal
                                .toLocaleString()}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Discount
                        </span>

                        <strong>
                            KSh{" "}
                            {sale.discount
                                .toLocaleString()}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Tax
                        </span>

                        <strong>
                            KSh{" "}
                            {sale.tax
                                .toLocaleString()}
                        </strong>

                    </div>


                    <div className="sale-modal-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            KSh{" "}
                            {sale.total
                                .toLocaleString()}
                        </strong>

                    </div>

                </div>


                <div className="sale-modal-footer">

                    <button
                        className="secondary-btn"
                        onClick={onClose}
                    >
                        Close
                    </button>


                    <button
                        className="primary-btn"
                    >
                        <FiPrinter />

                        Print Receipt
                    </button>

                </div>

            </div>

        </div>

    );

}


export default SaleDetailsModal;
