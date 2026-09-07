import {
    FiBox,
    FiCheckCircle,
    FiAlertTriangle,
    FiLayers
} from "react-icons/fi";

function ProductStats() {

    const stats = [
        {
            title: "Products",
            value: 245,
            icon: <FiBox />
        },
        {
            title: "Active",
            value: 220,
            icon: <FiCheckCircle />
        },
        {
            title: "Low Stock",
            value: 18,
            icon: <FiAlertTriangle />
        },
        {
            title: "Categories",
            value: 12,
            icon: <FiLayers />
        }
    ];

    return (

        <div className="stats-grid">

            {

                stats.map((stat) => (

                    <div
                        key={stat.title}
                        className="stat-card"
                    >

                        <div className="stat-icon">

                            {stat.icon}

                        </div>

                        <h2>

                            {stat.value}

                        </h2>

                        <p>

                            {stat.title}

                        </p>

                    </div>

                ))

            }

        </div>

    );

}

export default ProductStats;