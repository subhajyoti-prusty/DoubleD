const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/roleAuth');
const ngoController = require('../controllers/ngoController');
const notificationController = require('../controllers/notificationController');

// NGO Resource Management
router.post('/resources', authorize('ngo'), ngoController.createResource);
router.get('/resources', authorize('ngo'), ngoController.getResources);
router.put('/resources/:id', authorize('ngo'), ngoController.updateResource);
router.delete('/resources/:id', authorize('ngo'), ngoController.deleteResource);

// NGO Volunteer Management
router.get('/volunteers', authorize('ngo'), ngoController.getVolunteers);
router.post('/volunteers/assign', authorize('ngo'), ngoController.assignVolunteer);

// NGO Statistics and Reports
router.get('/statistics', authorize('ngo'), ngoController.getStatistics);
router.get('/reports', authorize('ngo'), ngoController.generateReports);

// Get all notifications for a user
router.get('/notifications', notificationController.getNotifications);

// Get unread notifications count
router.get('/notifications/unread', notificationController.getUnreadCount);

// Mark notification as read
router.patch('/notifications/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.patch('/notifications/read-all', notificationController.markAllAsRead);

// Delete a notification
router.delete('/notifications/:id', notificationController.deleteNotification);

// Delete all read notifications
router.delete('/notifications/clear-read', notificationController.clearReadNotifications);

module.exports = router; 