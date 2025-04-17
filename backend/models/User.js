const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['member', 'trainer', 'gymOwner', 'superAdmin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'member'
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  gymName: {
    type: String,
    default: '',
    required: function() {
      return this.role === 'gymOwner';
    }
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role !== 'gymOwner';
    }
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
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to superAdmin
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  }
});

// Pre-save hook to validate gym owner data
UserSchema.pre('save', function(next) {
  if (this.role === 'gymOwner' && !this.gymName) {
    const error = new Error('Gym name is required for gym owners');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema); 