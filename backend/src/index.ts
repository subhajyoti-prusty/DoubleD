import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import alertRoutes from "./routes/alertRoutes";
import volunteerRoutes from "./routes/volunteerRoutes";
import resourceRoutes from "./routes/resourceRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // Attach Socket.io

app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/resources", resourceRoutes);

// WebSocket Connection Handling
io.on("connection", (socket) => {
    console.log("New WebSocket connection:", socket.id);

    // Listen for disaster alerts from admins/NGOs
    socket.on("sendAlert", (alertData) => {
        console.log("New Alert:", alertData);
        io.emit("receiveAlert", alertData); // Broadcast alert to all users
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
