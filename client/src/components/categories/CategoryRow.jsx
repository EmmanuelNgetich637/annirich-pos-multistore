import {
    FiEdit2,
    FiTrash2,
    FiEye
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function CategoryRow({ category }) {

    return (
        <tr>

            <td>
                <strong>
                    {category.name}
                </strong>
            </td>

            <td>
                {category.description}
            </td>

            <td>
                {category.productCount}
            </td>

            <td>
                <StatusBadge
                    status={category.status}
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

export default CategoryRow;