const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'application_approval', 
      'application_rejection', 
      'new_member', 
      'membership_expired',
      'appointment_scheduled',
      'appointment_approved',
      'appointment_rejected',
      'workout_assigned',
      'system'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Could be a reference to many things (User, Membership, etc.)
  },
  data: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema); 