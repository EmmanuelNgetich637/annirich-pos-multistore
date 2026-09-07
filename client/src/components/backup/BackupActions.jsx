import {
    FiDatabase,
    FiRefreshCw,
    FiUploadCloud
} from "react-icons/fi";

function BackupActions() {

    return (
        <div className="backup-actions-card">

            <div className="backup-actions-header">

                <div className="backup-action-icon">
                    <FiDatabase />
                </div>

                <div>
                    <h3>Database Backup</h3>

                    <p>
                        Protect your business data by
                        creating regular backups.
                    </p>
                </div>

            </div>

            <div className="backup-action-buttons">

                <button className="primary-btn">
                    <FiDatabase />
                    Create Backup
                </button>

                <button className="secondary-btn">
                    <FiRefreshCw />
                    Refresh
                </button>

                <button className="secondary-btn">
                    <FiUploadCloud />
                    Restore Backup
                </button>

            </div>

        </div>
    );
}

export default BackupActions;