const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    default: 'member'
  },
  gymOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  },
  plan: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    default: 'basic'
  },
  membershipStart: {
    type: Date,
    default: Date.now
  },
  membershipEnd: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  goals: [{
    type: String
  }],
  healthConditions: [{
    type: String
  }],
  workoutPlans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  }],
  progressTracking: [{
    date: {
      type: Date,
      default: Date.now
    },
    weight: Number,
    measurements: {
      chest: Number,
      waist: Number,
      arms: Number,
      legs: Number
    },
    notes: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
memberSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for membership status
memberSchema.virtual('membershipStatus').get(function() {
  if (!this.isActive) return 'inactive';
  if (!this.membershipEnd) return 'lifetime';
  
  return Date.now() < this.membershipEnd.getTime() ? 'active' : 'expired';
});

// Ensure virtuals are included when converting to JSON
memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Member', memberSchema); 