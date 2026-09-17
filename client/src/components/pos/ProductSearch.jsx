import { useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";

function ProductSearch({ products, onAdd }) {
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((product) => {
        const term = search.toLowerCase().trim();

        const name = (product.name || "").toLowerCase();

        const barcode = (product.barcode || "").toLowerCase();

        const category = (product.category || "").toLowerCase();

        return (
            name.includes(term) ||
            barcode.includes(term) ||
            category.includes(term)
        );
    });

    return (
        <div className="pos-product-search">

            <div className="pos-search-box">
                <FiSearch />

                <input
                    type="text"
                    placeholder="Search product or scan barcode..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="pos-product-grid">

                {filteredProducts.length === 0 ? (
                    <div className="pos-no-products">
                        <p>No products found.</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            className="pos-product-card"
                            onClick={() => onAdd(product)}
                            disabled={Number(product.stock) <= 0}
                        >
                            <div className="pos-product-info">

                                <span className="pos-product-category">
                                    {product.category}
                                </span>

                                <strong>
                                    {product.name}
                                </strong>

                                <small>
                                    Stock: {product.stock}
                                </small>

                            </div>

                            <div className="pos-product-bottom">

                                <strong>
                                    KSh{" "}
                                    {Number(
                                        product.price || 0
                                    ).toLocaleString()}
                                </strong>

                                <span className="pos-add-icon">
                                    <FiPlus />
                                </span>

                            </div>
                        </button>
                    ))
                )}

            </div>
        </div>
    );
}

export default ProductSearch;