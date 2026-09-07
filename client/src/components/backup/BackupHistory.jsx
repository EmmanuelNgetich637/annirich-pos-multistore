import {
    FiDatabase,
    FiDownload,
    FiRotateCcw,
    FiMoreVertical
} from "react-icons/fi";

function BackupHistory({ backups }) {

    return (
        <div className="backup-history-card">

            <div className="backup-history-header">

                <div>
                    <h3>Backup History</h3>

                    <span>
                        Previous database backups
                    </span>
                </div>

            </div>

            <div className="backup-table-container">

                <table className="backup-table">

                    <thead>
                        <tr>
                            <th>Backup</th>
                            <th>Date</th>
                            <th>Size</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {backups.map((backup) => (
                            <tr key={backup.id}>

                                <td>
                                    <div className="backup-name">

                                        <div className="backup-file-icon">
                                            <FiDatabase />
                                        </div>

                                        <strong>
                                            {backup.name}
                                        </strong>

                                    </div>
                                </td>

                                <td>
                                    <div className="backup-date">

                                        <strong>
                                            {backup.date}
                                        </strong>

                                        <span>
                                            {backup.time}
                                        </span>

                                    </div>
                                </td>

                                <td>
                                    {backup.size}
                                </td>

                                <td>
                                    <span className="backup-type">
                                        {backup.type}
                                    </span>
                                </td>

                                <td>
                                    <span className="backup-completed">
                                        {backup.status}
                                    </span>
                                </td>

                                <td>

                                    <div className="backup-row-actions">

                                        <button
                                            type="button"
                                            title="Download"
                                        >
                                            <FiDownload />
                                        </button>

                                        <button
                                            type="button"
                                            title="Restore"
                                        >
                                            <FiRotateCcw />
                                        </button>

                                        <button
                                            type="button"
                                            title="More"
                                        >
                                            <FiMoreVertical />
                                        </button>

                                    </div>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default BackupHistory;