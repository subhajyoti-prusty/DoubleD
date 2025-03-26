const Volunteer = require("../models/Volunteer");

/**
 * @desc    Register a new volunteer
 * @route   POST /api/volunteers
 * @access  Private
 */
const registerVolunteer = async (req, res) => {
    try {
        const volunteer = new Volunteer(req.body);
        await volunteer.save();
        res.status(201).json({
            success: true,
            data: volunteer
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

/**
 * @desc    Get all volunteers with pagination
 * @route   GET /api/volunteers
 * @access  Public
 */
const getVolunteers = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const volunteers = await Volunteer.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Volunteer.countDocuments();

        res.json({
            success: true,
            count: volunteers.length,
            pagination: {
                page,
                pages: Math.ceil(total / limit)
            },
            data: volunteers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

/**
 * @desc    Get single volunteer by ID
 * @route   GET /api/volunteers/:id
 * @access  Private
 */
const getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        
        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }

        res.json({
            success: true,
            data: volunteer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

/**
 * @desc    Update volunteer information
 * @route   PUT /api/volunteers/:id
 * @access  Private
 */
const updateVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            volunteer[key] = req.body[key];
        });

        await volunteer.save();

        res.json({
            success: true,
            data: volunteer
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

/**
 * @desc    Delete volunteer
 * @route   DELETE /api/volunteers/:id
 * @access  Private
 */
const deleteVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }

        await volunteer.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

/**
 * @desc    Update volunteer availability
 * @route   PATCH /api/volunteers/:id/availability
 * @access  Private
 */
const updateAvailability = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }

        volunteer.availability = req.body.availability;
        await volunteer.save();

        res.json({
            success: true,
            data: volunteer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

module.exports = {
    registerVolunteer,
    getVolunteers,
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer,
    updateAvailability
};
