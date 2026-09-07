import {
    FiEdit2,
    FiTrash2,
    FiEye
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function ProductRow({ product }) {

    return (

        <tr>

            <td>{product.barcode}</td>

            <td>{product.name}</td>

            <td>{product.category}</td>

            <td>KES {product.buyingPrice.toLocaleString()}</td>

            <td>KES {product.sellingPrice.toLocaleString()}</td>

            <td>{product.stock}</td>

            <td>

                <StatusBadge
                    status={product.status}
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

export default ProductRow;