// backend/routes/trainer.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Plan = require('../models/Plan');
const { verifyToken, permitRoles, verifyApproved } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Progress = require('../models/Progress');
const Appointment = require('../models/Appointment');

// Get all clients assigned to the trainer
router.get('/clients', 
  verifyToken, 
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const trainerId = req.user.userId;
      
      // Find all members assigned to this trainer
      const clients = await User.find({ 
        role: 'member',
        trainerId: trainerId
      }).select('-password');
      
      res.json(clients);
    } catch (err) {
      console.error('Error fetching trainer clients:', err);
      res.status(500).json({ message: 'Server error fetching clients' });
    }
});

// Get a specific client's training plans
router.get('/client-plans/:clientId', 
  verifyToken, 
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const { clientId } = req.params;
      const trainerId = req.user.userId;
      
      // Verify client belongs to this trainer
      const client = await User.findOne({ 
        _id: clientId,
        role: 'member',
        trainerId: trainerId
      });
      
      if (!client) {
        return res.status(404).json({ 
          message: 'Client not found or not assigned to you'
        });
      }
      
      // Get client's plans
      const plans = await Plan.findOne({ userId: clientId });
      
      // If no plans exist yet, return empty object
      if (!plans) {
        return res.json({ workout: '', diet: '' });
      }
      
      res.json(plans);
    } catch (err) {
      console.error('Error fetching client plans:', err);
      res.status(500).json({ message: 'Server error fetching client plans' });
    }
});

// Assign workout/diet plan to a client
router.post('/assign-plan/:clientId', 
  verifyToken, 
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const { clientId } = req.params;
      const { workout, diet } = req.body;
      const trainerId = req.user.userId;
      
      // Verify client belongs to this trainer
      const client = await User.findOne({ 
        _id: clientId,
        role: 'member',
        trainerId: trainerId
      });
      
      if (!client) {
        return res.status(404).json({ 
          message: 'Client not found or not assigned to you'
        });
      }
      
      // Update or create plan
      const plan = await Plan.findOneAndUpdate(
        { userId: clientId },
        { 
          userId: clientId,
          workout,
          diet,
          trainerId,
          updatedAt: Date.now()
        },
        { upsert: true, new: true }
      );
      
      res.json({ 
        message: 'Plan assigned successfully',
        plan
      });
    } catch (err) {
      console.error('Error assigning plan:', err);
      res.status(500).json({ message: 'Server error assigning plan' });
    }
});

// 🏋️ Create Workout Plan
router.post(
  '/create-plan',
  verifyToken,
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const { name, exercises, duration, assignedTo } = req.body;

      // Validate that the client is assigned to this trainer
      const member = await User.findOne({
        _id: assignedTo,
        assignedTrainer: req.user._id
      });

      if (!member) {
        return res.status(403).json({ error: 'Client not assigned to you or does not exist' });
      }

      const plan = new Plan({
        name,
        exercises,
        duration,
        assignedTo,
        trainer: req.user._id,
      });

      await plan.save();
      res.json({ message: 'Workout plan created', plan });
    } catch (err) {
      res.status(500).json({ error: 'Plan creation failed' });
    }
  }
);

// 🗒️ Add Trainer Notes
router.post(
  '/client/:id/notes',
  verifyToken,
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const { notes } = req.body;

      // Verify client is assigned to this trainer
      const member = await User.findOne({
        _id: req.params.id,
        assignedTrainer: req.user._id
      });

      if (!member) {
        return res.status(403).json({ error: 'Client not assigned to you or does not exist' });
      }

      await User.findByIdAndUpdate(req.params.id, {
        trainerNotes: notes,
      });

      res.json({ message: 'Notes updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Could not update notes' });
    }
  }
);

// Get all workout plans for a specific client
router.get(
  '/client/:id/plans',
  verifyToken,
  permitRoles('trainer'),
  async (req, res) => {
    try {
      // Verify client is assigned to this trainer
      const member = await User.findOne({
        _id: req.params.id,
        assignedTrainer: req.user._id
      });

      if (!member) {
        return res.status(403).json({ error: 'Client not assigned to you or does not exist' });
      }

      const plans = await Plan.find({
        assignedTo: req.params.id,
        trainer: req.user._id
      }).sort({ createdAt: -1 });

      res.json(plans);
    } catch (err) {
      res.status(500).json({ error: 'Could not fetch workout plans' });
    }
  }
);

// Get trainer profile
router.get(
  '/profile',
  verifyToken,
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const profile = await User.findById(req.user._id).select('-password');
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
);

// Update trainer profile
router.put(
  '/profile',
  verifyToken,
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const { name, phone, specialization } = req.body;
      
      // Fields to update
      const profileFields = {};
      if (name) profileFields.name = name;
      if (phone) profileFields.phone = phone;
      if (specialization) profileFields.specialization = specialization;
      
      const profile = await User.findByIdAndUpdate(
        req.user._id,
        { $set: profileFields },
        { new: true }
      ).select('-password');
      
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// Delete a workout plan
router.delete(
  '/plan/:id',
  verifyToken,
  permitRoles('trainer'),
  async (req, res) => {
    try {
      // Ensure the plan belongs to this trainer
      const plan = await Plan.findOne({ 
        _id: req.params.id,
        trainer: req.user._id
      });
      
      if (!plan) {
        return res.status(404).json({ error: 'Workout plan not found or not authorized' });
      }
      
      await Plan.findByIdAndDelete(req.params.id);
      res.json({ message: 'Workout plan deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete workout plan' });
    }
  }
);

// Add the dashboard analytics endpoint for trainers
router.get('/dashboard', 
  verifyToken, 
  permitRoles('trainer'),
  async (req, res) => {
    try {
      const trainerId = req.user.userId;
      
      // Get all clients assigned to this trainer
      const clients = await User.find({ 
        role: 'member',
        trainerId: trainerId
      }).select('_id name email');
      
      const totalClients = clients.length;
      const clientIds = clients.map(client => client._id);
      
      // Get workouts assigned today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const plansUpdatedToday = await Plan.countDocuments({
        trainerId: trainerId,
        updatedAt: { $gte: today }
      });
      
      // Get at-risk clients (those who missed sessions or haven't logged in recently)
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Get attendance for each client in the past week
      const clientAttendance = await Attendance.find({
        member: { $in: clientIds },
        date: { $gte: oneWeekAgo }
      }).select('member date');
      
      // Group attendance by client
      const attendanceByClient = clientAttendance.reduce((acc, record) => {
        const clientId = record.member.toString();
        if (!acc[clientId]) {
          acc[clientId] = 0;
        }
        acc[clientId]++;
        return acc;
      }, {});
      
      // Find clients with less than 2 attendances in the past week
      const atRiskClientIds = clientIds.filter(id => {
        const clientIdStr = id.toString();
        return !attendanceByClient[clientIdStr] || attendanceByClient[clientIdStr] < 2;
      });
      
      // Get at-risk client details
      const atRiskClients = await User.find({
        _id: { $in: atRiskClientIds },
      }).select('name email');
      
      // Get progress trends for clients
      // For each client, get their latest progress and compare with previous
      const clientProgress = await Promise.all(
        clients.map(async (client) => {
          const progress = await Progress.find({ member: client._id })
            .sort({ date: -1 })
            .limit(2);
          
          let trend = "No Data";
          if (progress.length >= 2) {
            // Compare the latest two weight records
            const latest = progress[0].weight;
            const previous = progress[1].weight;
            
            if (latest < previous) {
              trend = "Losing Weight";
            } else if (latest > previous) {
              trend = "Gaining Weight";
            } else {
              trend = "Maintaining";
            }
          } else if (progress.length === 1) {
            trend = "Started Tracking";
          }
          
          return {
            name: client.name,
            email: client.email,
            trend
          };
        })
      );
      
      // Get upcoming appointments for today
      const appointments = await Appointment.find({
        withTrainer: trainerId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }).populate('member', 'name').sort({ time: 1 });
      
      res.json({
        totalClients,
        workoutsToday: plansUpdatedToday,
        atRiskClients: atRiskClients.map(client => ({
          id: client._id,
          name: client.name,
          email: client.email
        })),
        clientProgress,
        todaysAppointments: appointments.map(apt => ({
          id: apt._id,
          clientName: apt.member?.name || "Unknown",
          time: apt.time,
          notes: apt.notes
        }))
      });
    } catch (err) {
      console.error('Error fetching trainer dashboard:', err);
      res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
});

module.exports = router; 