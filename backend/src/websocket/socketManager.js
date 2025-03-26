const socketManager = (io) => {
    // Room Management
    const rooms = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join user-specific room
        socket.on('joinUserRoom', (userId) => {
            socket.join(`user-${userId}`);
        });

        // Join disaster-specific room
        socket.on('joinDisasterRoom', (disasterId) => {
            socket.join(`disaster-${disasterId}`);
            if (!rooms.has(disasterId)) {
                rooms.set(disasterId, new Set());
            }
            rooms.get(disasterId).add(socket.id);
        });

        // Live Location Updates
        socket.on('updateLocation', (data) => {
            const { userId, location } = data;
            io.to(`user-${userId}`).emit('locationUpdate', {
                userId,
                location
            });
        });

        // Chat Functionality
        socket.on('sendMessage', (data) => {
            const { room, message, sender } = data;
            io.to(room).emit('newMessage', {
                sender,
                message,
                timestamp: new Date()
            });
        });

        // Resource Tracking
        socket.on('resourceUpdate', (data) => {
            const { resourceId, status, location } = data;
            io.emit('resourceTracking', {
                resourceId,
                status,
                location,
                timestamp: new Date()
            });
        });

        socket.on('disconnect', () => {
            // Clean up rooms
            rooms.forEach((users, roomId) => {
                users.delete(socket.id);
                if (users.size === 0) {
                    rooms.delete(roomId);
                }
            });
        });
    });
};

module.exports = socketManager; 