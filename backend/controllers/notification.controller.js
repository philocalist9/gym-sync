const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send a notification to a user
const sendNotification = async (req, res) => {
  try {
    const { recipient, sender, type, title, message, entityId, data } = req.body;
    
    // Create notification in the database
    const notification = await createNotification({
      recipient,
      sender,
      type,
      title,
      message,
      entityId,
      data
    });
    
    // Send real-time notification if user is connected
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    const socketId = activeConnections.get(recipient);
    
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    }
    
    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
};

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // For mock IDs in development, return mock data
    if (userId.startsWith('mock-id-')) {
      return res.status(200).json({ 
        success: true, 
        notifications: [
          {
            _id: '1',
            recipient: userId,
            sender: null,
            type: 'welcome',
            title: 'Welcome to GymSync',
            message: 'Thank you for joining GymSync!',
            read: false,
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            recipient: userId,
            sender: null,
            type: 'info',
            title: 'Getting Started',
            message: 'Check out your dashboard to get started!',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      });
    }
    
    // Regular database query for real users
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email')
      .limit(100);
    
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read', error: error.message });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
    
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all notifications as read', error: error.message });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const result = await Notification.findByIdAndDelete(notificationId);
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
};

// Utility function to create and broadcast notification
const createAndBroadcastNotification = async (req, notificationData) => {
  try {
    const notification = await createNotification(notificationData);
    
    // Send real-time notification if user is connected
    const io = req.app.get('io');
    const activeConnections = req.app.get('activeConnections');
    const socketId = activeConnections.get(notificationData.recipient.toString());
    
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating and broadcasting notification:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createAndBroadcastNotification
}; 