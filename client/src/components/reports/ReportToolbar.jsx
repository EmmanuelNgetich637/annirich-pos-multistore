import { FiCalendar, FiDownload, FiPrinter } from "react-icons/fi";

function ReportToolbar() {

    return (
        <div className="report-toolbar">

            <div className="report-date-section">

                <div className="report-date-input">
                    <FiCalendar />

                    <div>
                        <span>From</span>

                        <strong>
                            01 Aug 2026
                        </strong>
                    </div>
                </div>

                <div className="report-date-input">
                    <FiCalendar />

                    <div>
                        <span>To</span>

                        <strong>
                            07 Aug 2026
                        </strong>
                    </div>
                </div>

                <select defaultValue="all">
                    <option value="all">
                        All Sales
                    </option>

                    <option value="completed">
                        Completed
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>
                </select>

            </div>

            <div className="report-actions">

                <button className="secondary-btn">
                    <FiPrinter />
                    Print
                </button>

                <button className="primary-btn">
                    <FiDownload />
                    Export
                </button>

            </div>

        </div>
    );
}

export default ReportToolbar;