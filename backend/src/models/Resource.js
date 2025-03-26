const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['food', 'water', 'medical', 'shelter', 'clothing', 'other'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true
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
        enum: ['available', 'allocated', 'in-transit', 'delivered'],
        default: 'available'
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    expiryDate: Date,
    notes: String
}, { timestamps: true });

resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Resource", resourceSchema);
