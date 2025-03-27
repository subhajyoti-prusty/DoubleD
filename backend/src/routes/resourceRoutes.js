const express = require("express");
const { addResource, getResources, updateResource, deleteResource } = require("../controllers/resourceController");
const { authenticateUser } = require("../middleware/authMiddleware");
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');
const authorize = require('../middleware/roleAuth');

const router = express.Router();

// Get all resources (with filters)
router.get('/', auth, async (req, res) => {
    try {
        const { type, status, location } = req.query;
        let query = {};

        // Apply filters
        if (type) query.type = type;
        if (status) query.status = status;
        if (location) {
            // Assuming location is passed as "lat,lng,radius" in kilometers
            const [lat, lng, radius] = location.split(',').map(Number);
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    $maxDistance: radius * 1000 // Convert km to meters
                }
            };
        }

        const resources = await Resource.find(query)
            .populate('owner', 'username email')
            .sort({ createdAt: -1 });

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get resource by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('owner', 'username email');

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new resource (admin and NGO only)
router.post('/', auth, authorize(['admin', 'ngo']), async (req, res) => {
    try {
        const resource = new Resource({
            ...req.body,
            owner: req.user.userId
        });

        await resource.save();

        // Populate owner info
        await resource.populate('owner', 'username email');

        // Emit socket event for real-time updates
        req.app.get('io').emit('newResource', resource);

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update resource (admin, NGO, and owner only)
router.put('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && 
            req.user.role !== 'ngo' && 
            resource.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update resource
        Object.assign(resource, req.body);
        await resource.save();

        // Populate updated info
        await resource.populate('owner', 'username email');

        // Emit socket event for real-time updates
        req.app.get('io').emit('resourceUpdated', resource);

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete resource (admin and owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && resource.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await resource.remove();

        // Emit socket event for real-time updates
        req.app.get('io').emit('resourceDeleted', req.params.id);

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update resource status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const resource = await Resource.findById(req.params.id);
        
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && 
            req.user.role !== 'ngo' && 
            resource.owner.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        resource.status = status;
        await resource.save();

        // Emit socket event for real-time updates
        req.app.get('io').emit('resourceStatusUpdated', {
            id: resource._id,
            status: resource.status
        });

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get resources by location
router.get('/location/:lat/:lng/:radius', auth, async (req, res) => {
    try {
        const { lat, lng, radius } = req.params;
        const resources = await Resource.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
                }
            }
        })
        .populate('owner', 'username email')
        .sort({ createdAt: -1 });

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get resources by type
router.get('/type/:type', auth, async (req, res) => {
    try {
        const resources = await Resource.find({ type: req.params.type })
            .populate('owner', 'username email')
            .sort({ createdAt: -1 });

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
