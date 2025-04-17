const express = require('express');
const router = express.Router();
const { 
  sendNotification, 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} = require('../controllers/notification.controller');
const auth = require('../middleware/auth');

// @route   POST /api/notifications
// @desc    Send a new notification
// @access  Private
router.post('/', auth, sendNotification);

// @route   GET /api/notifications/user/:userId
// @desc    Get all notifications for a user
// @access  Private
router.get('/user/:userId', auth, getNotifications);

// @route   PUT /api/notifications/:notificationId/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:notificationId/read', auth, markAsRead);

// @route   PUT /api/notifications/user/:userId/read-all
// @desc    Mark all notifications as read for a user
// @access  Private
router.put('/user/:userId/read-all', auth, markAllAsRead);

// @route   DELETE /api/notifications/:notificationId
// @desc    Delete a notification
// @access  Private
router.delete('/:notificationId', auth, deleteNotification);

module.exports = router; 