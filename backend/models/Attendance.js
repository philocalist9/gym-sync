const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: String,
  status: String,
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema); 