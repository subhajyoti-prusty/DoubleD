const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['alert', 'message', 'system'],
        default: 'system'
    },
    link: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema); 