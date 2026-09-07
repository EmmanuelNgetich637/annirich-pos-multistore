import {
    FiBriefcase,
    FiSettings,
    FiShield
} from "react-icons/fi";

function SettingsSidebar({ activeTab, setActiveTab }) {

    const sections = [
        {
            id: "business",
            title: "Business",
            description: "Business information",
            icon: <FiBriefcase />
        },
        {
            id: "system",
            title: "System",
            description: "Application preferences",
            icon: <FiSettings />
        },
        {
            id: "security",
            title: "Security",
            description: "Security and access",
            icon: <FiShield />
        }
    ];

    return (
        <div className="settings-sidebar">

            {sections.map(section => (

                <button
                    key={section.id}
                    type="button"
                    className={
                        activeTab === section.id
                            ? "settings-nav-item active"
                            : "settings-nav-item"
                    }
                    onClick={() =>
                        setActiveTab(section.id)
                    }
                >

                    <span className="settings-nav-icon">
                        {section.icon}
                    </span>

                    <span className="settings-nav-content">

                        <strong>
                            {section.title}
                        </strong>

                        <small>
                            {section.description}
                        </small>

                    </span>

                </button>

            ))}

        </div>
    );
}

export default SettingsSidebar;