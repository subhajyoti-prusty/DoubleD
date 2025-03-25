const express = require('express');
const { addResource, getResources } = require('../controllers/resourceController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to protect routes

router.post('/', authMiddleware, addResource);
router.get('/', getResources);

module.exports = router;
