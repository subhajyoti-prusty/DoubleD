const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

// Get all volunteers (admin and NGO only)
router.get('/', authenticateUser, authorizeRole(['admin', 'ngo']), async (req, res) => {
    try {
        const { location, skills, availability } = req.query;
        let query = {};

        // Apply filters
        if (location) query.location = location;
        if (skills) query.skills = { $in: skills.split(',') };
        if (availability !== undefined) query.availability = availability === 'true';

        const volunteers = await Volunteer.find(query);
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get volunteer by ID
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new volunteer (admin only)
router.post('/', authenticateUser, authorizeRole(['admin']), async (req, res) => {
    try {
        const volunteer = new Volunteer(req.body);
        await volunteer.save();
        res.status(201).json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update volunteer (admin and self)
router.put('/:id', authenticateUser, async (req, res) => {
    try {
        // Check if user is admin or the volunteer themselves
        if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete volunteer (admin only)
router.delete('/:id', authenticateUser, authorizeRole(['admin']), async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json({ message: 'Volunteer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update volunteer availability
router.patch('/:id/availability', authenticateUser, async (req, res) => {
    try {
        const { availability } = req.body;
        
        // Check if user is admin or the volunteer themselves
        if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            { availability },
            { new: true }
        );

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update volunteer verification status (admin only)
router.patch('/:id/verify', authenticateUser, authorizeRole(['admin']), async (req, res) => {
    try {
        const { verificationStatus } = req.body;
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            { verificationStatus },
            { new: true }
        );

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }

        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get volunteers by location (admin and NGO only)
router.get('/location/:location', authenticateUser, authorizeRole(['admin', 'ngo']), async (req, res) => {
    try {
        const volunteers = await Volunteer.find({ location: req.params.location });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get volunteers by skills (admin and NGO only)
router.get('/skills/:skills', authenticateUser, authorizeRole(['admin', 'ngo']), async (req, res) => {
    try {
        const skills = req.params.skills.split(',');
        const volunteers = await Volunteer.find({ skills: { $in: skills } });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
