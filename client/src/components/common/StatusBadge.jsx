import clsx from "clsx";

function StatusBadge({ status }) {

    const normalizedStatus =
        status.toLowerCase();

    let className = "status-badge";

    if (normalizedStatus === "active") {
        className += " active";
    }

    if (normalizedStatus === "inactive") {
        className += " inactive";
    }

    if (normalizedStatus === "paid") {
        className += " paid";
    }

    if (normalizedStatus === "partial") {
        className += " partial";
    }

    if (normalizedStatus === "pending") {
        className += " pending";
    }

    return (
        <span className={className}>
            {status}
        </span>
    );
}

export default StatusBadge;