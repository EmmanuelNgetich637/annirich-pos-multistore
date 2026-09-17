function ReportToolbar({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
}) {
    return (
        <div className="report-toolbar">
            <div className="report-date-group">
                <label>
                    From
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartDateChange(e.target.value)}
                    />
                </label>

                <label>
                    To
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                    />
                </label>
            </div>
        </div>
    );
}

export default ReportToolbar;
