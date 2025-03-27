const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/authMiddleware');
const ngoController = require('../controllers/ngoController');

router.post('/resources', authorizeRole(['ngo']), ngoController.createResource);
router.get('/statistics', authorizeRole(['ngo']), ngoController.getStatistics);
router.get('/volunteers', authorizeRole(['ngo']), ngoController.getVolunteers);

module.exports = router; 