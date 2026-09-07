import {
    FiGrid,
    FiShoppingCart,
    FiBox,
    FiClipboard,
    FiPackage,
    FiTruck,
    FiUsers,
    FiDollarSign,
    FiBarChart2,
    FiSettings,
    FiShield,
    FiDatabase,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";

import { NavLink } from "react-router-dom";

import { useState } from "react";

function Sidebar() {

    const [collapsed, setCollapsed] = useState(false);

    const menu = [

        {
            title: "Dashboard",
            icon: <FiGrid />,
            path: "/dashboard"
        },

        {
            title: "POS",
            icon: <FiShoppingCart />,
            path: "/pos"
        },

        {
            title: "Products",
            icon: <FiBox />,
            path: "/products"
        },

        {
            title: "Categories",
            icon: <FiClipboard />,
            path: "/categories"
        },

        {
            title: "Purchases",
            icon: <FiPackage />,
            path: "/purchases"
        },

        {
            title: "Suppliers",
            icon: <FiTruck />,
            path: "/suppliers"
        },

        {
            title: "Customers",
            icon: <FiUsers />,
            path: "/customers"
        },

        {
            title: "Sales",
            icon: <FiDollarSign />,
            path: "/sales"
        },

        {
            title: "Reports",
            icon: <FiBarChart2 />,
            path: "/reports"
        },

        {
            title: "Users",
            icon: <FiShield />,
            path: "/users"
        },

        {
            title: "Backup",
            icon: <FiDatabase />,
            path: "/backup"
        },

        {
            title: "Settings",
            icon: <FiSettings />,
            path: "/settings"
        }

    ];

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="logo">

                <div className="logo-icon">
                    A
                </div>

                {!collapsed && (

                    <div>

                        <h2>ANNIRICH</h2>

                        <small>Hardware POS</small>

                    </div>

                )}

            </div>

            <nav>

                {

                    menu.map((item) => (

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({ isActive }) =>
                                isActive
                                    ? "menu-item active"
                                    : "menu-item"
                            }

                        >

                            <span className="icon">

                                {item.icon}

                            </span>

                            {

                                !collapsed &&

                                <span>

                                    {item.title}

                                </span>

                            }

                        </NavLink>

                    ))

                }

            </nav>

            <button

                className="collapse-btn"

                onClick={() =>
                    setCollapsed(!collapsed)
                }

            >

                {

                    collapsed

                        ? <FiChevronRight />

                        : <FiChevronLeft />

                }

            </button>

        </aside>

    );

}

export default Sidebar;