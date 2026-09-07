import { FiPackage } from "react-icons/fi";

function TopProducts({ products }) {

    return (
        <div className="top-products-card">

            <div className="report-chart-header">

                <div>
                    <h3>Top Selling Products</h3>

                    <span>
                        Best performing products
                    </span>
                </div>

            </div>

            <div className="top-products-list">

                {products.map((product, index) => (

                    <div
                        className="top-product-row"
                        key={product.id}
                    >

                        <div className="top-product-rank">
                            {index + 1}
                        </div>

                        <div className="top-product-icon">
                            <FiPackage />
                        </div>

                        <div className="top-product-info">

                            <strong>
                                {product.name}
                            </strong>

                            <span>
                                {product.category}
                            </span>

                        </div>

                        <div className="top-product-quantity">

                            <strong>
                                {product.quantity}
                            </strong>

                            <span>
                                units
                            </span>

                        </div>

                        <div className="top-product-revenue">

                            <strong>
                                KES {product.revenue.toLocaleString()}
                            </strong>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default TopProducts;