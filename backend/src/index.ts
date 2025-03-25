import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import alertRoutes from "./routes/alertRoutes";
import volunteerRoutes from "./routes/volunteerRoutes";
import authRoutes from "./routes/authRoutes";
import resourceRoutes from "./routes/resourceRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/volunteers", volunteerRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("MongoDB connection error:", err));
