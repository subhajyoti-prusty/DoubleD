const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("Connection string:", process.env.MONGO_URI);
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("MongoDB Connected Successfully!");
    } catch (err) {
        console.error("MongoDB connection error details:", {
            name: err.name,
            message: err.message,
            code: err.code,
            stack: err.stack
        });
        process.exit(1);
    }
};

module.exports = connectDB;
