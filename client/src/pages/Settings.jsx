import { useState } from "react";

import PageHeader from "../components/common/PageHeader";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import BusinessSettings from "../components/settings/BusinessSettings";
import SystemSettings from "../components/settings/SystemSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

function Settings() {

    const [activeTab, setActiveTab] =
        useState("business");

    const renderContent = () => {

        switch (activeTab) {

            case "system":
                return <SystemSettings />;

            case "security":
                return <SecuritySettings />;

            case "business":
            default:
                return <BusinessSettings />;
        }
    };

    return (
        <div className="settings-page">

            <PageHeader
                title="Settings"
                subtitle="Manage your business, system and security preferences."
            />

            <div className="settings-layout">

                <SettingsSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className="settings-content">
                    {renderContent()}
                </div>

            </div>

        </div>
    );
}

export default Settings;