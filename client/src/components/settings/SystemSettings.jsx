import { useState } from "react";

function SystemSettings() {

    const [currency, setCurrency] =
        useState("KES");

    const [timezone, setTimezone] =
        useState("Africa/Nairobi");

    const [dateFormat, setDateFormat] =
        useState("DD/MM/YYYY");

    const [lowStock, setLowStock] =
        useState(true);

    const [autoBackup, setAutoBackup] =
        useState(true);

    const handleSubmit = event => {
        event.preventDefault();

        console.log("System settings saved");
    };

    return (
        <form
            className="settings-form"
            onSubmit={handleSubmit}
        >

            <div className="settings-section-header">

                <h2>System Preferences</h2>

                <p>
                    Configure general application
                    preferences for your POS.
                </p>

            </div>

            <div className="settings-form-grid">

                <div className="form-group">

                    <label>
                        Currency
                    </label>

                    <select
                        value={currency}
                        onChange={e =>
                            setCurrency(e.target.value)
                        }
                    >
                        <option value="KES">
                            Kenyan Shilling (KES)
                        </option>

                        <option value="USD">
                            US Dollar (USD)
                        </option>

                        <option value="EUR">
                            Euro (EUR)
                        </option>
                    </select>

                </div>

                <div className="form-group">

                    <label>
                        Timezone
                    </label>

                    <select
                        value={timezone}
                        onChange={e =>
                            setTimezone(e.target.value)
                        }
                    >
                        <option value="Africa/Nairobi">
                            Africa/Nairobi
                        </option>

                        <option value="UTC">
                            UTC
                        </option>
                    </select>

                </div>

                <div className="form-group">

                    <label>
                        Date Format
                    </label>

                    <select
                        value={dateFormat}
                        onChange={e =>
                            setDateFormat(e.target.value)
                        }
                    >
                        <option value="DD/MM/YYYY">
                            DD/MM/YYYY
                        </option>

                        <option value="MM/DD/YYYY">
                            MM/DD/YYYY
                        </option>

                        <option value="YYYY-MM-DD">
                            YYYY-MM-DD
                        </option>
                    </select>

                </div>

            </div>

            <div className="settings-options">

                <div className="settings-option">

                    <div>
                        <strong>
                            Low Stock Alerts
                        </strong>

                        <p>
                            Show notifications when
                            products reach their low-stock level.
                        </p>
                    </div>

                    <label className="settings-switch">

                        <input
                            type="checkbox"
                            checked={lowStock}
                            onChange={e =>
                                setLowStock(e.target.checked)
                            }
                        />

                        <span />
                    </label>

                </div>

                <div className="settings-option">

                    <div>
                        <strong>
                            Automatic Backups
                        </strong>

                        <p>
                            Automatically create scheduled
                            database backups.
                        </p>
                    </div>

                    <label className="settings-switch">

                        <input
                            type="checkbox"
                            checked={autoBackup}
                            onChange={e =>
                                setAutoBackup(e.target.checked)
                            }
                        />

                        <span />
                    </label>

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

export default SystemSettings;