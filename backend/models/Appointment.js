const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  withTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  time: String,
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema); 