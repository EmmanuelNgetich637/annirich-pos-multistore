import { useState } from "react";

function SecuritySettings() {

    const [sessionTimeout, setSessionTimeout] =
        useState("30");

    const [twoFactor, setTwoFactor] =
        useState(false);

    const [loginAlerts, setLoginAlerts] =
        useState(true);

    const handleSubmit = event => {
        event.preventDefault();

        console.log("Security settings saved");
    };

    return (
        <form
            className="settings-form"
            onSubmit={handleSubmit}
        >

            <div className="settings-section-header">

                <h2>Security Settings</h2>

                <p>
                    Manage authentication and system
                    security preferences.
                </p>

            </div>

            <div className="settings-form-grid">

                <div className="form-group">

                    <label>
                        Session Timeout
                    </label>

                    <select
                        value={sessionTimeout}
                        onChange={e =>
                            setSessionTimeout(e.target.value)
                        }
                    >
                        <option value="15">
                            15 minutes
                        </option>

                        <option value="30">
                            30 minutes
                        </option>

                        <option value="60">
                            1 hour
                        </option>

                        <option value="120">
                            2 hours
                        </option>
                    </select>

                </div>

            </div>

            <div className="settings-options">

                <div className="settings-option">

                    <div>
                        <strong>
                            Two-Factor Authentication
                        </strong>

                        <p>
                            Require an additional verification
                            step when users sign in.
                        </p>
                    </div>

                    <label className="settings-switch">

                        <input
                            type="checkbox"
                            checked={twoFactor}
                            onChange={e =>
                                setTwoFactor(e.target.checked)
                            }
                        />

                        <span />
                    </label>

                </div>

                <div className="settings-option">

                    <div>
                        <strong>
                            Login Alerts
                        </strong>

                        <p>
                            Record and notify administrators
                            about new login activity.
                        </p>
                    </div>

                    <label className="settings-switch">

                        <input
                            type="checkbox"
                            checked={loginAlerts}
                            onChange={e =>
                                setLoginAlerts(e.target.checked)
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

export default SecuritySettings;