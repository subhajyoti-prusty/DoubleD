const Resource = require('../models/Resource');

// Create a new resource
const addResource = async (req, res) => {
    const { type, quantity, location } = req.body;
    try {
        const resource = new Resource({ type, quantity, location, addedBy: req.user.id });
        await resource.save();
        res.status(201).json(resource);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all resources
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { addResource, getResources };
