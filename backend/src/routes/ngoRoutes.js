const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/roleAuth');
const ngoController = require('../controllers/ngoController');

router.post('/resources', authorize('ngo'), ngoController.createResource);
router.get('/statistics', authorize('ngo'), ngoController.getStatistics);
router.get('/volunteers', authorize('ngo'), ngoController.getVolunteers);

module.exports = router; 