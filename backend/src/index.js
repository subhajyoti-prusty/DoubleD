const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { authenticateUser, authorizeRole } = require('./middleware/authMiddleware');
const socketManager = require('./websocket/socketManager');

// Load environment variables
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

// Basic test route
app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Protected routes
app.use('/api/resources', authenticateUser, require('./routes/resourceRoutes'));
app.use('/api/alerts', authenticateUser, require('./routes/alertRoutes'));
app.use('/api/volunteers', authenticateUser, require('./routes/volunteerRoutes'));

// NGO routes
app.use('/api/ngo', authenticateUser, authorizeRole(['ngo']), require('./routes/ngoRoutes'));

// Notification routes
app.use('/api/notifications', authenticateUser, require('./routes/notificationRoutes'));

// Admin routes
app.use('/api/admin', authenticateUser, authorizeRole(['admin']), require('./routes/adminRoutes'));

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

    // Handle notifications
    socket.on("notification", (data) => {
        const { userId, notification } = data;
        io.to(`user-${userId}`).emit("newNotification", notification);
    });
    
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Initialize socket manager
socketManager(io);

// Connect to MongoDB
mongoose.set('strictQuery', false);
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

// Make io accessible to our routes
app.set('io', io);

// Export for testing
module.exports = { app, server, io };
