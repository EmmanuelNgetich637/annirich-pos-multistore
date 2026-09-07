import { FiX } from "react-icons/fi";

function CategoryModal({ open, onClose }) {

    if (!open) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="modal category-modal">

                <div className="modal-header">

                    <div>
                        <h2>
                            Add Category
                        </h2>

                        <p>
                            Create a new product category.
                        </p>
                    </div>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        <FiX />
                    </button>

                </div>

                <div className="modal-body">

                    <div className="form-group">

                        <label>
                            Category Name
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Paints & Coatings"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            placeholder="Describe this category..."
                            rows="4"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>

                <div className="modal-footer">

                    <button
                        className="secondary-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button className="primary-btn">
                        Save Category
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CategoryModal;