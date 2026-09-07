import {
    FiShoppingCart,
    FiDollarSign,
    FiPackage
} from "react-icons/fi";

function POSStats() {

    const stats = [
        {
            title: "Today's Sales",
            value: "KSh 128,500",
            icon: <FiDollarSign />
        },
        {
            title: "Transactions",
            value: "34",
            icon: <FiShoppingCart />
        },
        {
            title: "Items Sold",
            value: "127",
            icon: <FiPackage />
        }
    ];

    return (
        <div className="pos-stats">

            {stats.map((stat) => (

                <div
                    className="pos-stat"
                    key={stat.title}
                >

                    <div className="stat-icon">
                        {stat.icon}
                    </div>

                    <div>

                        <strong>
                            {stat.value}
                        </strong>

                        <span>
                            {stat.title}
                        </span>

                    </div>

                </div>

            ))}

        </div>
    );
}

export default POSStats;