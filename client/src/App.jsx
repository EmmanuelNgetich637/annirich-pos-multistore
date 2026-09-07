import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import POS from "./pages/POS";
import Purchases from "./pages/Purchases";
import Suppliers from "./pages/Suppliers";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Backup from "./pages/Backup";

import AppLayout from "./layouts/AppLayout";

function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/categories"
                    element={<Categories />}
                />

                <Route
                    path="/customers"
                    element={<Customers />}
                />

                <Route
                    path="/sales"
                    element={<Sales />}
                />

                <Route
                    path="/pos"
                    element={<POS />}
                />

                <Route
                    path="/purchases"
                    element={<Purchases />}
                />

                <Route
                    path="/suppliers"
                    element={<Suppliers />}
                />

                <Route
                    path="/expenses"
                    element={<Expenses />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

                <Route
                    path="/users"
                    element={<Users />}
                />

                <Route
                    path="/backup"
                    element={<Backup />}
                />

            </Route>
        </Routes>
    );
}

export default App;