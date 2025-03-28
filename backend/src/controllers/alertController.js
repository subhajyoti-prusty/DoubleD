const Alert = require("../models/Alert");
const User = require("../models/User");

let io; // Variable to store Socket.io instance

const setSocketIoInstance = (ioInstance) => {
    io = ioInstance;
};

// Create a new disaster alert
const createAlert = async (req, res) => {
    try {
        const alert = await Alert.create({
            ...req.body,
            createdBy: req.user.id
        });

        // Send real-time notification via WebSocket
        const io = req.app.get('io');
        
        // Broadcast to all users in affected area
        io.emit('newAlert', {
            type: alert.type,
            priority: alert.priority,
            title: alert.title,
            description: alert.description
        });

        // Send notifications to specific users based on role/location
        const nearbyUsers = await User.find({
            'profile.location': {
                $near: {
                    $geometry: alert.location,
                    $maxDistance: alert.affectedArea.radius * 1000 // convert to meters
                }
            }
        });

        nearbyUsers.forEach(user => {
            io.to(`user-${user._id}`).emit('alertNotification', {
                alertId: alert._id,
                title: alert.title,
                priority: alert.priority
            });
        });

        res.status(201).json({
            success: true,
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateAlert = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        const io = req.app.get('io');
        io.emit('alertUpdate', {
            alertId: alert._id,
            updates: req.body
        });

        res.json({
            success: true,
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all alerts
const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find()
            .populate('createdBy', 'name email')
            .sort('-createdAt');

        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete an alert
const deleteAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                error: 'Alert not found'
            });
        }

        // Check if user is authorized to delete the alert
        if (alert.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this alert'
            });
        }

        await alert.remove();

        // Notify users about alert deletion
        const io = req.app.get('io');
        io.emit('alertDeleted', {
            alertId: alert._id
        });

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = { createAlert, setSocketIoInstance, updateAlert, getAlerts, deleteAlert };
