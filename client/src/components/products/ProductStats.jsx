import {
    FiBox,
    FiCheckCircle,
    FiAlertTriangle,
    FiLayers
} from "react-icons/fi";


function ProductStats({ products = [] }) {

    const totalProducts = products.length;


    const activeProducts = products.filter(
        (product) =>
            String(product.status || "").toLowerCase() === "active"
    ).length;


    const lowStockProducts = products.filter(
        (product) => {

            const quantity =
                Number(product.quantity ?? 0);

            const minimumStock =
                Number(product.minimum_stock ?? 0);

            return (
                String(product.status || "").toLowerCase() === "active" &&
                product.minimum_stock !== null &&
                product.minimum_stock !== undefined &&
                quantity <= minimumStock
            );

        }
    ).length;


    const categories = new Set(
        products
            .map(
                (product) =>
                    product.category_name ||
                    product.category
            )
            .filter(Boolean)
    ).size;


    const stats = [
        {
            title: "Products",
            value: totalProducts,
            icon: <FiBox />
        },
        {
            title: "Active",
            value: activeProducts,
            icon: <FiCheckCircle />
        },
        {
            title: "Low Stock",
            value: lowStockProducts,
            icon: <FiAlertTriangle />
        },
        {
            title: "Categories",
            value: categories,
            icon: <FiLayers />
        }
    ];


    return (
        <div className="stats-grid">

            {stats.map((stat) => (

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

            ))}

        </div>
    );
}


export default ProductStats;
