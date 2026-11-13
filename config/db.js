
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("Database Error:", error.message);
        throw error;
    }
};

module.exports = connectDB;
