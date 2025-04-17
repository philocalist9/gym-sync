const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  planName: String,
  startDate: String,
  endDate: String,
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'pending'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending'
  },
  amount: Number,
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Reference to gym owner
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema); 