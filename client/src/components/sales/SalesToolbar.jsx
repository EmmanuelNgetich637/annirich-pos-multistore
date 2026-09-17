import {
    FiSearch,
    FiDownload,
    FiCalendar
} from "react-icons/fi";

function SalesToolbar({
    search,
    setSearch,
    paymentMethod,
    setPaymentMethod,
    status,
    setStatus,
    selectedDate,
    setSelectedDate,
    onExport,
    exporting
}) {

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const clearDate = () => {
        setSelectedDate("");
    };

    return (
        <div className="sales-toolbar">

            <div className="sales-search">

                <FiSearch />

                <input
                    type="text"
                    placeholder="Search invoice, customer or cashier..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            <div className="sales-filters">

                <select
                    value={paymentMethod}
                    onChange={(e) =>
                        setPaymentMethod(e.target.value)
                    }
                >
                    <option value="All">
                        All Payments
                    </option>

                    <option value="Cash">
                        Cash
                    </option>

                    <option value="M-Pesa">
                        M-Pesa
                    </option>

                    <option value="Card">
                        Card
                    </option>
                </select>

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >
                    <option value="All">
                        All Status
                    </option>

                    <option value="Completed">
                        Completed
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Failed">
                        Failed
                    </option>

                    <option value="Cancelled">
                        Cancelled
                    </option>
                </select>

                <label className="sales-date-btn">
                    <FiCalendar />

                    <span>
                        {selectedDate || "Today"}
                    </span>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        aria-label="Filter sales by date"
                    />
                </label>

                {selectedDate && (
                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={clearDate}
                    >
                        Today
                    </button>
                )}

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={onExport}
                    disabled={exporting}
                >
                    <FiDownload />

                    {exporting
                        ? "Exporting..."
                        : "Export"}
                </button>

            </div>

        </div>
    );
}

export default SalesToolbar;