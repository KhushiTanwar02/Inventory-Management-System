
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Inventory Management System API is Running");
});

// Product Routes
app.use("/api/products", productRoutes);

// Error Handling
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Server Error:", error.message);
    }
};

startServer();
