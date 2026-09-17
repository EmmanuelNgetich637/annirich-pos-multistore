function LowStockTable({ products = [] }) {

    return (

        <div className="table-card">

            <h3>Low Stock Products</h3>

            {products.length === 0 ? (

                <p>No low-stock products.</p>

            ) : (

                <div className="dashboard-table">

                    <table>

                        <thead>

                            <tr>
                                <th>Product</th>
                                <th>Stock</th>
                                <th>Minimum</th>
                            </tr>

                        </thead>

                        <tbody>

                            {products.map((product) => (

                                <tr key={product.id}>

                                    <td>
                                        {product.name}
                                    </td>

                                    <td>
                                        {product.quantity}
                                    </td>

                                    <td>
                                        {product.minimum_stock}
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

export default LowStockTable;
