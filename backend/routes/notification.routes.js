const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(verifyToken);

// @route   POST /api/notifications
// @desc    Send a new notification
// @access  Private
router.post('/', notificationController.sendNotification);

// @route   GET /api/notifications/user/:userId
// @desc    Get all notifications for a user
// @access  Private
router.get('/user/:userId', notificationController.getNotifications);

// @route   PUT /api/notifications/:notificationId/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:notificationId/read', notificationController.markAsRead);

// @route   PUT /api/notifications/user/:userId/read-all
// @desc    Mark all notifications as read for a user
// @access  Private
router.put('/user/:userId/read-all', notificationController.markAllAsRead);

// @route   DELETE /api/notifications/:notificationId
// @desc    Delete a notification
// @access  Private
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router; 