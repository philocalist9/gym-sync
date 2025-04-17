const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  weight: Number,
  bodyFat: Number,
  measurements: {
    chest: Number,
    waist: Number,
    arms: Number,
    legs: Number
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema); 