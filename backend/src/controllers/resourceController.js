const Resource = require("../models/Resource");

// Add a new resource
const addResource = async (req, res) => {
    try {
        const { type, quantity, location } = req.body;
        const resource = new Resource({ type, quantity, location, addedBy: req.user.id });
        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: "Error adding resource", error });
    }
};

// Get all resources
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate('provider', 'username')
            .populate('assignedTo', 'username');

        res.json({
            success: true,
            data: resources
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update a resource
const updateResource = async (req, res) => {
    try {
        const { type, quantity, location } = req.body;
        const resource = await Resource.findByIdAndUpdate(req.params.id, { type, quantity, location }, { new: true });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json(resource);
    } catch (error) {
        res.status(500).json({ message: "Error updating resource", error });
    }
};

// Delete a resource
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.json({ message: "Resource deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting resource", error });
    }
};

exports.createResource = async (req, res) => {
    try {
        const resource = await Resource.create({
            ...req.body,
            provider: req.user.id
        });

        // Emit socket event for real-time updates
        req.app.get('io').emit('resourceUpdate', {
            action: 'create',
            resource
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

exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate('provider', 'username')
            .populate('assignedTo', 'username');

        res.json({
            success: true,
            count: resources.length,
            data: resources
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateResource = async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!resource) {
            return res.status(404).json({
                success: false,
                error: 'Resource not found'
            });
        }

        // Emit socket event
        req.app.get('io').emit('resourceUpdate', {
            action: 'update',
            resource
        });

        res.json({
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

exports.allocateResource = async (req, res) => {
    try {
        const { userId } = req.body;
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                error: 'Resource not found'
            });
        }

        if (resource.status !== 'available') {
            return res.status(400).json({
                success: false,
                error: 'Resource is not available'
            });
        }

        resource.assignedTo = userId;
        resource.status = 'allocated';
        await resource.save();

        // Emit socket event
        req.app.get('io').emit('resourceUpdate', {
            action: 'allocate',
            resource
        });

        res.json({
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

module.exports = { addResource, getResources, updateResource, deleteResource };
