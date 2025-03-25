const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Socket.io setup
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendAlert', (alertData) => {
        io.emit('receiveAlert', alertData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
