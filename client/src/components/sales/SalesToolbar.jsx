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
    setStatus
}) {

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

                    <option value="Cancelled">
                        Cancelled
                    </option>
                </select>

                <button className="sales-date-btn">
                    <FiCalendar />
                    Today
                </button>

                <button className="secondary-btn">
                    <FiDownload />
                    Export
                </button>

            </div>

        </div>
    );
}

export default SalesToolbar;