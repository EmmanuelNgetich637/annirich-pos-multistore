import { useState } from "react";

function BusinessSettings() {

    const [businessName, setBusinessName] =
        useState("Annirich Hardware");

    const [phone, setPhone] =
        useState("+254 700 000 000");

    const [email, setEmail] =
        useState("info@annirich.co.ke");

    const [address, setAddress] =
        useState("Kenya");

    const [taxNumber, setTaxNumber] =
        useState("");

    const handleSubmit = event => {
        event.preventDefault();

        console.log("Business settings saved");
    };

    return (
        <form
            className="settings-form"
            onSubmit={handleSubmit}
        >

            <div className="settings-section-header">
                <h2>Business Information</h2>

                <p>
                    Manage the business information
                    displayed throughout the POS.
                </p>
            </div>

            <div className="settings-form-grid">

                <div className="form-group">
                    <label>
                        Business Name
                    </label>

                    <input
                        type="text"
                        value={businessName}
                        onChange={e =>
                            setBusinessName(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>
                        Phone Number
                    </label>

                    <input
                        type="text"
                        value={phone}
                        onChange={e =>
                            setPhone(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>
                        Business Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={e =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                <div className="form-group">
                    <label>
                        Tax / PIN Number
                    </label>

                    <input
                        type="text"
                        value={taxNumber}
                        onChange={e =>
                            setTaxNumber(e.target.value)
                        }
                        placeholder="Enter tax number"
                    />
                </div>

                <div className="form-group full-width">
                    <label>
                        Business Address
                    </label>

                    <textarea
                        value={address}
                        onChange={e =>
                            setAddress(e.target.value)
                        }
                        rows="4"
                    />
                </div>

            </div>

            <div className="settings-form-footer">

                <button
                    type="submit"
                    className="primary-btn"
                >
                    Save Changes
                </button>

            </div>

        </form>
    );
}

export default BusinessSettings;