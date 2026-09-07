import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

/* Base */
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/typography.css";
import "./styles/utilities.css";
import "./styles/modal.css";
import "./styles/pos.css";
import "./styles/sales.css";
import "./styles/reports.css";
import "./styles/users.css";
import "./styles/backup.css";
import "./styles/settings.css";


/* Components */
import "./styles/sidebar.css";
import "./styles/topbar.css";
import "./styles/buttons.css";
import "./styles/cards.css";
import "./styles/forms.css";
import "./styles/tables.css";

/* Pages */
import "./styles/dashboard.css";
import "./styles/login.css";
import "./styles/products.css";

/* Responsive & Animations */
import "./styles/responsive.css";
import "./styles/animations.css";
 
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);