const Resource = require('../models/Resource');
const User = require('../models/User');
const Alert = require('../models/Alert');

// Create a new resource
const createResource = async (req, res) => {
    try {
        const resource = await Resource.create({
            ...req.body,
            ngo: req.user.id
        });

        // Notify relevant users about new resource
        const io = req.app.get('io');
        io.emit('newResource', {
            type: resource.type,
            quantity: resource.quantity,
            location: resource.location
        });

        res.status(201).json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get NGO statistics
const getStatistics = async (req, res) => {
    try {
        const resourceCount = await Resource.countDocuments({ ngo: req.user.id });
        const activeAlerts = await Alert.countDocuments({ 
            createdBy: req.user.id,
            status: 'active'
        });
        const totalVolunteers = await User.countDocuments({
            role: 'volunteer',
            'profile.associatedNGOs': req.user.id
        });

        res.json({
            success: true,
            data: {
                resourceCount,
                activeAlerts,
                totalVolunteers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get volunteers associated with the NGO
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await User.find({
            role: 'volunteer',
            'profile.associatedNGOs': req.user.id
        })
        .select('name email profile.skills profile.availability')
        .sort('name');

        res.json({
            success: true,
            count: volunteers.length,
            data: volunteers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createResource,
    getStatistics,
    getVolunteers
}; 