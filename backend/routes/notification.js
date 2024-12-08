const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Get all notifications
router.get('/', auth, notificationController.getAllNotifications);

// Mark as read
router.put('/:notificationId/read', auth, notificationController.markAsRead);

module.exports = router; 