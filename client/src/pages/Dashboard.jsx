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

function Dashboard() {

    const stats = [

        {
            title: "Revenue",
            value: "KES 1,254,000",
            icon: <FiDollarSign />,
            color: "#2563EB"
        },

        {
            title: "Sales",
            value: "324",
            icon: <FiShoppingCart />,
            color: "#16A34A"
        },

        {
            title: "Products",
            value: "542",
            icon: <FiPackage />,
            color: "#F59E0B"
        },

        {
            title: "Customers",
            value: "186",
            icon: <FiUsers />,
            color: "#8B5CF6"
        }

    ];

    return (

        <>

            <DashboardHeader />

            <section className="stats-grid">

                {

                    stats.map((item) => (

                        <StatCard
                            key={item.title}
                            {...item}
                        />

                    ))

                }

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