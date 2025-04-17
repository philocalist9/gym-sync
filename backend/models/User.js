const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'trainer', 'gymOwner', 'superAdmin'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  gymName: {
    type: String,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // reference to gymOwner
  },
  specialization: {
    type: String,
    default: ''
  },
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // trainer
  },
  trainerNotes: {
    type: String,
    default: ''
  },
  membershipDetails: {
    type: {
      plan: String,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'pending'
      }
    },
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema); 