const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: ['disaster', 'emergency', 'warning', 'information'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number] // [longitude, latitude]
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'archived'],
        default: 'active'
    },
    affectedArea: {
        radius: Number, // in kilometers
        population: Number
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notifications: [{
        sentTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        sentAt: Date,
        readAt: Date
    }]
}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Alert", alertSchema);
