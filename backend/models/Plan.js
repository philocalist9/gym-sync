const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 10 },
  weight: { type: Number },
  notes: String
});

const workoutDaySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Monday", "Tuesday", etc.
  exercises: [exerciseSchema]
});

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  workoutDays: [workoutDaySchema],
  duration: { type: Number, default: 4 }, // duration in weeks
  goal: { 
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness'],
    default: 'general_fitness'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  notes: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema); 