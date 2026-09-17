import {
    useEffect,
    useState
} from "react";

import {
    FiDollarSign,
    FiShoppingCart,
    FiPackage,
    FiUsers
} from "react-icons/fi";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import SalesChart from "../components/dashboard/SalesChart";
import RecentSales from "../components/dashboard/RecentSales";
import LowStockTable from "../components/dashboard/LowStockTable";

import { getDashboard } from "../api/dashboardApi";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getDashboard();

                if (response.success) {
                    setDashboard(response.data);
                } else {
                    setError(
                        response.message ||
                        "Failed to load dashboard"
                    );
                }

            } catch (error) {

                console.error(
                    "Dashboard loading failed:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );

            } finally {

                setLoading(false);

            }

        };

        loadDashboard();

    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                {error}
            </div>
        );
    }

    const summary =
        dashboard?.summary || {};

    const stats = [

        {
            title: "Revenue",
            value: `KES ${Number(
                summary.revenue || 0
            ).toLocaleString()}`,
            icon: <FiDollarSign />,
            color: "#2563EB"
        },

        {
            title: "Sales",
            value: Number(
                summary.sales || 0
            ).toLocaleString(),
            icon: <FiShoppingCart />,
            color: "#16A34A"
        },

        {
            title: "Products",
            value: Number(
                summary.products || 0
            ).toLocaleString(),
            icon: <FiPackage />,
            color: "#F59E0B"
        },

        {
            title: "Customers",
            value: Number(
                summary.customers || 0
            ).toLocaleString(),
            icon: <FiUsers />,
            color: "#8B5CF6"
        }

    ];

    return (

        <>

            <DashboardHeader />

            <section className="stats-grid">

                {stats.map((item) => (

                    <StatCard
                        key={item.title}
                        {...item}
                    />

                ))}

            </section>

            <section className="chart-grid">

                <RevenueChart />

                <SalesChart />

            </section>

            <section className="table-grid">

                <RecentSales />

                <LowStockTable />

            </section>

        </>

    );

}

export default Dashboard;