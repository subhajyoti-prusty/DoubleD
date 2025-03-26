const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const socketManager = require('./websocket/socketManager');

// Load environment variables first
dotenv.config();

// Initialize express
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("A user connected");
    
    // Join room based on user role
    socket.on("joinRoom", (userData) => {
        socket.join(userData.role);
        socket.join(`user-${userData.id}`);
    });

    // Alert handling
    socket.on("sendAlert", (alertData) => {
        io.emit("receiveAlert", alertData);
    });

    // Resource updates
    socket.on("resourceUpdate", (data) => {
        io.emit("resourceChanged", data);
    });

    // Volunteer status updates
    socket.on("volunteerStatusUpdate", (data) => {
        io.to('admin').to('ngo').emit("volunteerStatusChanged", data);
    });

    // Emergency notifications
    socket.on("emergency", (data) => {
        io.emit("emergencyAlert", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// After creating io instance
socketManager(io);

// Routes (if you have them)
if (require.main === module) {
    try {
        // Add this line before mongoose.connect
        mongoose.set('strictQuery', false);

        // Connect to MongoDB
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Connected to MongoDB");
            // Start server after successful database connection
            const PORT = process.env.PORT || 5000;
            server.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
            process.exit(1);
        });
    } catch (error) {
        console.error("Server error:", error);
        process.exit(1);
    }
}

// Export for testing
module.exports = { app, server, io };
