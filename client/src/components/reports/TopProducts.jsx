function TopProducts({ products = [] }) {
    return (
        <div className="top-products">
            <div className="report-section-header">
                <div>
                    <h3>Top Products</h3>
                    <p>Best-selling products for the selected period.</p>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="report-empty">
                    No product sales for this period.
                </div>
            ) : (
                <div className="top-products-list">
                    {products.map((product, index) => (
                        <div
                            className="top-product-row"
                            key={product.id}
                        >
                            <div className="top-product-rank">
                                #{index + 1}
                            </div>

                            <div className="top-product-info">
                                <strong>
                                    {product.name}
                                </strong>

                                <span>
                                    {product.category || "Uncategorized"}
                                </span>
                            </div>

                            <div className="top-product-quantity">
                                {Number(product.quantity || 0)} sold
                            </div>

                            <div className="top-product-revenue">
                                KSh{" "}
                                {Number(product.revenue || 0).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TopProducts;
