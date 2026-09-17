import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import {
    createCategory,
    updateCategory
} from "../../api/categoryApi";

function CategoryModal({
    open,
    onClose,
    onCreated,
    category = null
}) {
    const isEditing = Boolean(category);

    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (open) {
            setForm({
                name: category?.name || "",
                description: category?.description || ""
            });

            setError("");
            setSuccess("");
        }
    }, [open, category]);

    if (!open) {
        return null;
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const name = form.name.trim();
        const description = form.description.trim();

        if (!name) {
            setError("Category name is required.");
            return;
        }

        try {
            setLoading(true);

            if (isEditing) {
                await updateCategory(
                    category.id,
                    {
                        name,
                        description: description || null
                    }
                );

                setSuccess(
                    "Category updated successfully."
                );
            } else {
                await createCategory({
                    name,
                    description: description || null
                });

                setSuccess(
                    "Category created successfully."
                );
            }

            if (onCreated) {
                await onCreated();
            }

            setTimeout(() => {
                onClose();
            }, 500);

        } catch (err) {
            console.error(
                "Failed to save category:",
                err
            );

            const validationErrors =
                err?.response?.data?.errors;

            if (Array.isArray(validationErrors)) {
                setError(
                    validationErrors
                        .map((item) => item.msg)
                        .join(", ")
                );
            } else {
                setError(
                    err?.response?.data?.message ||
                    "Failed to save category."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">

            <div className="modal category-modal">

                <div className="modal-header">

                    <div>
                        <h2>
                            {isEditing
                                ? "Edit Category"
                                : "Add Category"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update this product category."
                                : "Create a new product category."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <FiX />
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="modal-body">

                        {error && (
                            <div className="error-state">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-state">
                                {success}
                            </div>
                        )}

                        <div className="form-group">

                            <label>
                                Category Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Paints & Coatings"
                                disabled={loading}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe this category..."
                                rows="4"
                                disabled={loading}
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
                                : isEditing
                                    ? "Update Category"
                                    : "Save Category"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CategoryModal;