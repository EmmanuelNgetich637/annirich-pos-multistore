import { useEffect, useState } from "react";

import { FiX } from "react-icons/fi";

import {
    createCustomer,
    updateCustomer
} from "../../api/customerApi";


function CustomerModal({
    open,
    onClose,
    onSaved,
    customer
}) {

    const editing =
        Boolean(customer);


    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: ""
    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (customer) {

            setForm({
                name: customer.name || "",
                phone: customer.phone || "",
                email: customer.email || "",
                address: customer.address || ""
            });

        } else {

            setForm({
                name: "",
                phone: "",
                email: "",
                address: ""
            });

        }

        setError("");

    }, [customer, open]);


    if (!open) {
        return null;
    }


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setLoading(true);
            setError("");

            if (editing) {

                await updateCustomer(
                    customer.id,
                    form
                );

            } else {

                await createCustomer(form);

            }

            await onSaved?.();

            onClose();

        } catch (err) {

            console.error(
                "Failed to save customer:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.[0]?.msg ||
                "Failed to save customer.";

            setError(message);

        } finally {

            setLoading(false);

        }

    };


    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >

            <div
                className="modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <form
                    onSubmit={handleSubmit}
                    className="modal-form"
                >

                    <div className="modal-header">

                        <div>

                            <h2>
                                {editing
                                    ? "Edit Customer"
                                    : "Add Customer"}
                            </h2>

                            <p>
                                {editing
                                    ? "Update customer information."
                                    : "Add a new customer to your business."}
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
                            <div className="error-state">
                                {error}
                            </div>
                        )}


                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Customer name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="07XXXXXXXX"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    placeholder="customer@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                rows="3"
                                placeholder="Customer address"
                                value={form.address}
                                onChange={handleChange}
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
                                    ? "Update Customer"
                                    : "Save Customer"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default CustomerModal;
