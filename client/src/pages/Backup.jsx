import PageHeader from "../components/common/PageHeader";

import BackupStats from "../components/backup/BackupStats";
import BackupActions from "../components/backup/BackupActions";
import BackupHistory from "../components/backup/BackupHistory";

import {
    backupStats,
    backups
} from "../data/backups";

function Backup() {

    return (
        <div className="backup-page">

            <PageHeader
                title="Backup & Restore"
                subtitle="Manage your database backups and protect your business data."
            />

            <BackupStats
                stats={backupStats}
            />

            <BackupActions />

            <BackupHistory
                backups={backups}
            />

        </div>
    );
}

export default Backup;