import { motion } from "framer-motion";

function StatCard({
    title,
    value,
    icon,
    color
}) {
    return (
        <motion.div
            className="stat-card"
            whileHover={{ y: -6 }}
        >
            <div
                className="stat-icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div>
                <h4>{title}</h4>
                <h2>{value}</h2>
            </div>
        </motion.div>
    );
}

export default StatCard;