import {
    FiDatabase,
    FiClock,
    FiHardDrive,
    FiCheckCircle
} from "react-icons/fi";

function BackupStats({ stats }) {

    const cards = [
        {
            title: "Last Backup",
            value: stats.lastBackup,
            icon: <FiClock />
        },
        {
            title: "Total Backups",
            value: stats.totalBackups,
            icon: <FiDatabase />
        },
        {
            title: "Storage Used",
            value: stats.storageUsed,
            icon: <FiHardDrive />
        },
        {
            title: "Backup Status",
            value: stats.backupStatus,
            icon: <FiCheckCircle />
        }
    ];

    return (
        <div className="backup-stats">

            {cards.map(card => (
                <div
                    className="backup-stat-card"
                    key={card.title}
                >
                    <div className="backup-stat-icon">
                        {card.icon}
                    </div>

                    <div>
                        <span>{card.title}</span>
                        <strong>{card.value}</strong>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default BackupStats;