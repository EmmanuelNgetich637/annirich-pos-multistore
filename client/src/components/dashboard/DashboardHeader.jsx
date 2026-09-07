import { FiBell } from "react-icons/fi";

function DashboardHeader() {
    return (
        <div className="dashboard-header">
            <div>
                <h1>Dashboard</h1>
                <p>Welcome back to Annirich Hardware POS.</p>
            </div>

            <button className="notification-btn">
                <FiBell />
                <span className="notification-dot"></span>
            </button>
        </div>
    );
}

export default DashboardHeader;