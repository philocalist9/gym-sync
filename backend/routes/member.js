// backend/routes/member.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Plan = require('../models/Plan');
const { verifyToken, permitRoles } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Appointment = require('../models/Appointment');
const Membership = require('../models/Membership');
const Progress = require('../models/Progress');

// Get member's assigned trainer
router.get('/trainer', 
  verifyToken, 
  permitRoles('member'),
  async (req, res) => {
    try {
      const memberId = req.user.userId;
      
      // Get member details with trainer ID
      const member = await User.findById(memberId);
      
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      if (!member.trainerId) {
        return res.status(404).json({ message: 'No trainer assigned' });
      }
      
      // Get trainer details
      const trainer = await User.findOne({ 
        _id: member.trainerId,
        role: 'trainer'
      }).select('-password');
      
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
      
      res.json(trainer);
    } catch (err) {
      console.error('Error fetching trainer:', err);
      res.status(500).json({ message: 'Server error fetching trainer' });
    }
});

// Get member's workout and diet plans
router.get('/plans', 
  verifyToken, 
  permitRoles('member'),
  async (req, res) => {
    try {
      const memberId = req.user.userId;
      
      // Find member's plans
      const plans = await Plan.findOne({ userId: memberId });
      
      if (!plans) {
        return res.json({ workout: '', diet: '' });
      }
      
      res.json(plans);
    } catch (err) {
      console.error('Error fetching plans:', err);
      res.status(500).json({ message: 'Server error fetching plans' });
    }
});

// Get member profile
router.get('/profile', 
  verifyToken, 
  permitRoles('member'),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      
      // Find member
      const member = await User.findById(userId).select('-password');
      
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      res.json(member);
    } catch (err) {
      console.error('Error fetching member profile:', err);
      res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// Update member profile
router.put('/profile', 
  verifyToken, 
  permitRoles('member'),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, email, phone } = req.body;
      
      // Find and update member
      const updatedMember = await User.findByIdAndUpdate(
        userId,
        { name, email, phone },
        { new: true }
      ).select('-password');
      
      if (!updatedMember) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      res.json({
        message: 'Profile updated successfully',
        user: updatedMember
      });
    } catch (err) {
      console.error('Error updating member profile:', err);
      res.status(500).json({ message: 'Server error updating profile' });
    }
});

// Provide feedback on a plan
router.post('/feedback', 
  verifyToken, 
  permitRoles('member'),
  async (req, res) => {
    try {
      const memberId = req.user.userId;
      const { feedback } = req.body;
      
      if (!feedback) {
        return res.status(400).json({ message: 'Feedback is required' });
      }
      
      // Update plan with feedback
      const plan = await Plan.findOneAndUpdate(
        { userId: memberId },
        { 
          $push: { 
            feedback: {
              text: feedback,
              date: new Date()
            } 
          } 
        },
        { new: true }
      );
      
      if (!plan) {
        return res.status(404).json({ message: 'No plan found to provide feedback' });
      }
      
      res.json({
        message: 'Feedback submitted successfully',
        plan
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      res.status(500).json({ message: 'Server error submitting feedback' });
    }
});

// 📋 Get Assigned Workout Plan
router.get(
  '/workout-plan',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const plan = await Plan.findOne({ assignedTo: req.user.userId });
      
      if (!plan) {
        return res.status(404).json({ message: 'No workout plan assigned yet' });
      }
      
      res.json(plan);
    } catch (err) {
      console.error('Error fetching workout plan:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 📈 Get Progress Tracker Data
router.get(
  '/progress',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const progress = await Progress.find({ member: req.user.userId }).sort({ date: -1 });
      res.json(progress);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 📈 Add Progress Tracker Entry
router.post(
  '/progress',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const { weight, bodyFat, measurements, notes } = req.body;
      
      const progressEntry = new Progress({
        member: req.user.userId,
        weight,
        bodyFat,
        measurements,
        notes
      });
      
      await progressEntry.save();
      res.status(201).json({ message: 'Progress entry added', progress: progressEntry });
    } catch (err) {
      console.error('Error adding progress entry:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ✅ Mark Attendance
router.post(
  '/attendance',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const today = new Date().toDateString();

      const existing = await Attendance.findOne({
        member: req.user.userId,
        date: today,
      });

      if (existing) {
        return res.status(400).json({ message: 'Already marked today' });
      }

      const attendance = new Attendance({
        member: req.user.userId,
        date: today,
        status: 'Present',
      });

      await attendance.save();
      res.json({ message: 'Attendance marked', attendance });
    } catch (err) {
      console.error('Error marking attendance:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 📅 View Attendance History
router.get(
  '/attendance',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const attendanceHistory = await Attendance.find({ member: req.user.userId }).sort({ date: -1 });
      res.json(attendanceHistory);
    } catch (err) {
      console.error('Error fetching attendance history:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 📅 View Appointments
router.get(
  '/appointments',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const appointments = await Appointment.find({ member: req.user.userId })
        .populate('withTrainer', 'name email')
        .sort({ date: 1, time: 1 });
      res.json(appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 📅 Book Appointment
router.post(
  '/appointments',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const { date, time, withTrainer, notes } = req.body;

      // Validate input
      if (!date || !time || !withTrainer) {
        return res.status(400).json({ message: 'Date, time, and trainer are required' });
      }

      const appointment = new Appointment({
        member: req.user.userId,
        date,
        time,
        withTrainer,
        notes,
        status: 'pending'
      });

      await appointment.save();
      res.status(201).json({ message: 'Appointment booked', appointment });
    } catch (err) {
      console.error('Error booking appointment:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 📅 Cancel Appointment
router.delete(
  '/appointments/:id',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Check if appointment belongs to the user
      if (appointment.member.toString() !== req.user.userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
      }
      
      await Appointment.findByIdAndDelete(req.params.id);
      res.json({ message: 'Appointment cancelled' });
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// 💳 Membership Status
router.get(
  '/membership',
  verifyToken,
  permitRoles('member'),
  async (req, res) => {
    try {
      const membership = await Membership.findOne({ member: req.user.userId });
      
      if (!membership) {
        return res.status(404).json({ message: 'No active membership found' });
      }
      
      res.json(membership);
    } catch (err) {
      console.error('Error fetching membership:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Add the dashboard analytics endpoint for members
router.get('/dashboard', 
  verifyToken, 
  permitRoles('member'),
  async (req, res) => {
    try {
      const memberId = req.user.userId;
      
      // Get the member's plan
      const plan = await Plan.findOne({ userId: memberId });
      
      // Get completed workouts this week
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const completedWorkouts = await Attendance.countDocuments({
        member: memberId,
        date: { $gte: startOfWeek },
        status: 'Present'
      });
      
      // Get weight progress from user progress records (last 4 entries)
      const progressEntries = await Progress.find({ member: memberId })
        .sort({ date: -1 })
        .limit(4);
      
      const weightProgress = progressEntries.map(entry => entry.weight).reverse();
      
      // Get the next scheduled workout (from appointments)
      const nextAppointment = await Appointment.findOne({
        member: memberId,
        date: { $gte: new Date() }
      })
        .sort({ date: 1, time: 1 })
        .populate('withTrainer', 'name');
      
      // Dummy renewal prediction (in a real app, this would use ML)
      // Based on attendance frequency, progress updates, etc.
      let renewalPrediction = "Likely to Renew";
      if (completedWorkouts < 2 && progressEntries.length < 2) {
        renewalPrediction = "At Risk";
      }
      
      res.json({
        plan: plan ? plan.name || "Custom Fitness Plan" : "No Active Plan",
        completedWorkouts,
        weightProgress: weightProgress.length ? weightProgress : [0, 0, 0, 0],
        nextWorkout: nextAppointment ? 
          `${nextAppointment.notes || 'Training Session'} - ${new Date(nextAppointment.date).toLocaleDateString()}` : 
          "No upcoming workouts",
        renewalPrediction,
        // Add membership details if available
        membership: await Membership.findOne({ member: memberId })
      });
    } catch (err) {
      console.error('Error fetching member dashboard:', err);
      res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
});

module.exports = router; 