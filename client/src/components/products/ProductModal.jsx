import { FiX, FiUpload } from "react-icons/fi";

function ProductModal({ open, onClose }) {

    if (!open) return null;

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>Add Product</h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        <FiX />
                    </button>

                </div>

                <div className="modal-body">

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Product Name</label>
                            <input type="text" />
                        </div>

                        <div className="form-group">
                            <label>Barcode</label>
                            <input type="text" />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select>
                                <option>Select Category</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Supplier</label>
                            <select>
                                <option>Select Supplier</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Buying Price</label>
                            <input type="number" />
                        </div>

                        <div className="form-group">
                            <label>Selling Price</label>
                            <input type="number" />
                        </div>

                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input type="number" />
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <select>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>

                    </div>

                    <div className="upload-box">

                        <FiUpload size={40} />

                        <p>Drag product image here</p>

                        <button className="secondary-btn">
                            Browse
                        </button>

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
                        Save Product
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductModal;