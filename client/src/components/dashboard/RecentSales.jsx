function RecentSales({ sales = [] }) {

    return (

        <div className="table-card">

            <h3>Recent Sales</h3>

            {sales.length === 0 ? (

                <p>No completed sales yet.</p>

            ) : (

                <div className="dashboard-table">

                    <table>

                        <thead>

                            <tr>
                                <th>Sale</th>
                                <th>Customer</th>
                                <th>Payment</th>
                                <th>Total</th>
                            </tr>

                        </thead>

                        <tbody>

                            {sales.map((sale) => (

                                <tr key={sale.id}>

                                    <td>
                                        SALE-{String(
                                            sale.id
                                        ).padStart(5, "0")}
                                    </td>

                                    <td>
                                        {sale.customer_name ||
                                            "Walk-in Customer"}
                                    </td>

                                    <td>
                                        {sale.payment_method}
                                    </td>

                                    <td>
                                        KES {Number(
                                            sale.total || 0
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}

export default RecentSales;
