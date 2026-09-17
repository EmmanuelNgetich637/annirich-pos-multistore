import { useEffect, useState } from "react";

import { FiX } from "react-icons/fi";

import {
    createSupplier,
    updateSupplier
} from "../../api/supplierApi";

function SupplierModal({
    open,
    onClose,
    onSaved,
    supplier
}) {

    const [form, setForm] = useState({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const editing = Boolean(supplier);

    useEffect(() => {

        if (supplier) {

            setForm({
                name: supplier.name || "",
                contact_person:
                    supplier.contact_person || "",
                phone: supplier.phone || "",
                email: supplier.email || "",
                address: supplier.address || ""
            });

        } else {

            setForm({
                name: "",
                contact_person: "",
                phone: "",
                email: "",
                address: ""
            });

        }

        setError("");

    }, [supplier, open]);

    if (!open) {
        return null;
    }

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!form.name.trim()) {

            setError(
                "Supplier name is required."
            );

            return;
        }

        try {

            setLoading(true);

            if (editing) {

                await updateSupplier(
                    supplier.id,
                    form
                );

            } else {

                await createSupplier(form);

            }

            await onSaved?.();

            onClose();

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save supplier."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <form
                    className="modal-form"
                    onSubmit={handleSubmit}
                >

                    <div className="modal-header">

                        <div>

                            <h2>
                                {editing
                                    ? "Edit Supplier"
                                    : "Add Supplier"}
                            </h2>

                            <p>
                                {editing
                                    ? "Update supplier information."
                                    : "Add a new supplier to your business."}
                            </p>

                        </div>

                        <button
                            type="button"
                            className="close-btn"
                            onClick={onClose}
                        >
                            <FiX />
                        </button>

                    </div>

                    <div className="modal-body">

                        {error && (

                            <div className="form-error">
                                {error}
                            </div>

                        )}

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Supplier Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Company name"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Contact Person
                                </label>

                                <input
                                    type="text"
                                    name="contact_person"
                                    value={
                                        form.contact_person
                                    }
                                    onChange={handleChange}
                                    placeholder="Contact person"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="07XXXXXXXX"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="supplier@example.com"
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <textarea
                                rows="3"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Supplier address"
                            />

                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : editing
                                    ? "Update Supplier"
                                    : "Save Supplier"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default SupplierModal;
