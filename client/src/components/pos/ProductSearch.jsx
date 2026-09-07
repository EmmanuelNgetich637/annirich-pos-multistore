import { useState } from "react";
import {
    FiSearch,
    FiPlus
} from "react-icons/fi";

function ProductSearch({ products, onAdd }) {

    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((product) => {

        const term = search.toLowerCase();

        return (
            product.name.toLowerCase().includes(term) ||
            product.barcode.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
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
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            <div className="pos-product-grid">

                {filteredProducts.map((product) => (

                    <button
                        className="pos-product-card"
                        key={product.id}
                        onClick={() => onAdd(product)}
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
                                KSh {product.price.toLocaleString()}
                            </strong>

                            <span className="pos-add-icon">
                                <FiPlus />
                            </span>

                        </div>

                    </button>

                ))}

            </div>

        </div>
    );
}

export default ProductSearch;