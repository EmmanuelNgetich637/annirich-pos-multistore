const path = require("path");
const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const saleRoutes = require("./routes/saleRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const db = require("./config/db");
const settingsRoutes = require("./routes/settingsRoutes");
const receiptRoutes = require("./routes/receiptRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const backupRoutes = require("./routes/backupRoutes");

// Load environment variables
dotenv.config();


// Create Express application
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


// Static uploads folder
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// Root API check
app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        message:
        "Welcome to Annirich Hardware POS API"

    });

});


// API Routes

app.use("/api/test", testRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/purchases", purchaseRoutes);

app.use("/api/sales", saleRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/settings", settingsRoutes);

app.use("/api/receipts", receiptRoutes);

app.use("/api/activity-logs", activityLogRoutes);

app.use("/api/backup", backupRoutes);

// Unknown route handler

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
        "Route not found"

    });

});



// Global error handler

app.use((err, req, res, next) => {

    console.error(err.stack);


    res.status(500).json({

        success: false,

        message:
        err.message || "Internal Server Error"

    });

});



// Server port

const PORT =
process.env.PORT || 5000;



// Start server

const server = app.listen(
    PORT,
    async () => {

        console.log(
            `🚀 Server running on http://localhost:${PORT}`
        );


        try {

            const connection =
                await db.getConnection();


            console.log(
                "✅ MySQL database connected"
            );


            connection.release();


        } catch(error) {

            console.error(
                "❌ Database connection failed:",
                error.message
            );

        }

    }
);



// Graceful shutdown

process.on(
    "SIGINT",
    () => {

        server.close(() => {

            console.log(
                "Server closed"
            );

            process.exit(0);

        });

    }
);