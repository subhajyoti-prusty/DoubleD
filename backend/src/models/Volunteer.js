const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: { 
        type: String, 
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    skills: { 
        type: [String], 
        required: true 
    },
    experienceLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'beginner'
    },
    availability: { 
        type: Boolean, 
        default: true 
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    assignedTasks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Task" 
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalHours: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ location: 1 });
volunteerSchema.index({ skills: 1 });

module.exports = mongoose.model("Volunteer", volunteerSchema);
