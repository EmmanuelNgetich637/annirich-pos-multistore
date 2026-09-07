import { FiX } from "react-icons/fi";

function CustomerModal({ open, onClose }) {

    if (!open) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <div>

                        <h2>
                            Add Customer
                        </h2>

                        <p>
                            Add a new customer to your business.
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

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Customer name"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="tel"
                                placeholder="07XXXXXXXX"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="customer@example.com"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <select>

                                <option>
                                    Active
                                </option>

                                <option>
                                    Inactive
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            rows="3"
                            placeholder="Customer address"
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Notes
                        </label>

                        <textarea
                            rows="3"
                            placeholder="Additional customer notes"
                        />

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
                        Save Customer
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CustomerModal;