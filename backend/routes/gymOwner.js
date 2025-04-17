// backend/routes/gymOwner.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, permitRoles, verifyApproved } = require('../middleware/auth');
const Membership = require('../models/Membership');
const Attendance = require('../models/Attendance');

// Get all users (members & trainers) of this gym
router.get('/users', 
  verifyToken, 
  permitRoles('gym-owner'),
  verifyApproved,
  async (req, res) => {
    try {
      const gymId = req.user.gymId;
      
      // Find users belonging to this gym (members and trainers)
      const users = await User.find({ 
        gymId: gymId,
        role: { $in: ['member', 'trainer'] }
      }).select('-password');
      
      res.json(users);
    } catch (err) {
      console.error('Error fetching gym users:', err);
      res.status(500).json({ message: 'Server error fetching gym users' });
    }
});

// Create a new user (member or trainer)
router.post('/create-user', 
  verifyToken, 
  permitRoles('gym-owner'),
  verifyApproved,
  async (req, res) => {
    try {
      const gymId = req.user.gymId;
      const { name, email, password, role } = req.body;
      
      // Validate input
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }
      
      // Ensure role is valid (only member or trainer)
      if (role !== 'member' && role !== 'trainer') {
        return res.status(400).json({ message: 'Role must be either member or trainer' });
      }
      
      // Check if user with this email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      // Create new user
      const newUser = new User({
        name,
        email,
        password, // Will be hashed in the model pre-save hook
        role,
        gymId,
        isApproved: true // Auto-approve users created by gym owner
      });
      
      await newUser.save();
      
      // Return user without password
      const userResponse = { ...newUser.toObject() };
      delete userResponse.password;
      
      res.status(201).json({ 
        message: 'User created successfully',
        user: userResponse
      });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ message: 'Server error creating user' });
    }
});

// Get gym owner profile
router.get('/profile', 
  verifyToken, 
  permitRoles('gym-owner'),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      
      // Find gym owner
      const gymOwner = await User.findById(userId).select('-password');
      
      if (!gymOwner) {
        return res.status(404).json({ message: 'Gym owner not found' });
      }
      
      res.json(gymOwner);
    } catch (err) {
      console.error('Error fetching gym owner profile:', err);
      res.status(500).json({ message: 'Server error fetching profile' });
    }
});

// Update gym owner profile
router.put('/profile', 
  verifyToken, 
  permitRoles('gym-owner'),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, gymName, phone, location, email } = req.body;
      
      // Find and update gym owner
      const updatedGymOwner = await User.findByIdAndUpdate(
        userId,
        { 
          name, 
          gymName, 
          phone, 
          location, 
          email 
        },
        { new: true }
      ).select('-password');
      
      if (!updatedGymOwner) {
        return res.status(404).json({ message: 'Gym owner not found' });
      }
      
      res.json({
        message: 'Profile updated successfully',
        user: updatedGymOwner
      });
    } catch (err) {
      console.error('Error updating gym owner profile:', err);
      res.status(500).json({ message: 'Server error updating profile' });
    }
});

// Delete a user (member or trainer)
router.delete('/user/:id', 
  verifyToken, 
  permitRoles('gym-owner'),
  verifyApproved,
  async (req, res) => {
    try {
      const gymId = req.user.gymId;
      const userId = req.params.id;
      
      // Find user and ensure they belong to this gym
      const user = await User.findOne({ 
        _id: userId,
        gymId: gymId,
        role: { $in: ['member', 'trainer'] }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found or not part of your gym' });
      }
      
      // Delete user
      await User.findByIdAndDelete(userId);
      
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: 'Server error deleting user' });
    }
});

// Analytics data for gym owner dashboard
router.get(
  '/analytics',
  verifyToken,
  permitRoles('gym-owner'),
  verifyApproved,
  async (req, res) => {
    try {
      const timeframe = req.query.timeframe || 'monthly';
      
      // Get counts of members and trainers
      const [membersCount, trainersCount] = await Promise.all([
        User.countDocuments({ role: 'member', createdBy: req.user._id }),
        User.countDocuments({ role: 'trainer', createdBy: req.user._id })
      ]);
      
      // Sample data for now - in a real app, this would come from database
      // with actual calculations based on the timeframe
      const revenueData = timeframe === 'weekly' ? 
        [
          { month: 'Mon', amount: 8500 },
          { month: 'Tue', amount: 7800 },
          { month: 'Wed', amount: 9200 },
          { month: 'Thu', amount: 8100 },
          { month: 'Fri', amount: 11500 },
          { month: 'Sat', amount: 15000 },
          { month: 'Sun', amount: 10000 }
        ] : timeframe === 'yearly' ?
        [
          { month: 'Jan', amount: 290000 },
          { month: 'Feb', amount: 310000 },
          { month: 'Mar', amount: 345000 },
          { month: 'Apr', amount: 330000 },
          { month: 'May', amount: 325000 },
          { month: 'Jun', amount: 340000 },
          { month: 'Jul', amount: 360000 },
          { month: 'Aug', amount: 375000 },
          { month: 'Sep', amount: 390000 },
          { month: 'Oct', amount: 405000 },
          { month: 'Nov', amount: 430000 },
          { month: 'Dec', amount: 450000 }
        ] :
        [
          { month: 'Jan', amount: 45000 },
          { month: 'Feb', amount: 48000 },
          { month: 'Mar', amount: 52000 },
          { month: 'Apr', amount: 50000 },
          { month: 'May', amount: 54000 },
          { month: 'Jun', amount: 58000 }
        ];
        
      const membershipStats = {
        basic: Math.floor(membersCount * 0.6),
        standard: Math.floor(membersCount * 0.3),
        premium: Math.ceil(membersCount * 0.1)
      };
      
      const attendanceData = timeframe === 'weekly' ?
        [
          { day: 'Mon', count: 35 },
          { day: 'Tue', count: 28 },
          { day: 'Wed', count: 32 },
          { day: 'Thu', count: 30 },
          { day: 'Fri', count: 42 },
          { day: 'Sat', count: 50 },
          { day: 'Sun', count: 25 }
        ] : [];
      
      res.json({
        revenueData,
        membershipStats,
        attendanceData,
        totalMembers: membersCount,
        totalTrainers: trainersCount,
        newTrainers: 2,  // Sample data
        revenueGrowth: 8, // Sample data - percentage growth
        attendanceGrowth: 5 // Sample data
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
  }
);

// Assign trainer to member
router.post(
  '/assign-trainer',
  verifyToken,
  permitRoles('gym-owner'),
  verifyApproved,
  async (req, res) => {
    try {
      const { memberId, trainerId } = req.body;

      // Ensure the member and trainer exist and belong to this gym owner
      const [member, trainer] = await Promise.all([
        User.findOne({ 
          _id: memberId, 
          createdBy: req.user._id,
          role: 'member'
        }),
        User.findOne({ 
          _id: trainerId, 
          createdBy: req.user._id,
          role: 'trainer'
        })
      ]);

      if (!member) {
        return res.status(404).json({ error: 'Member not found or not authorized' });
      }

      if (!trainer) {
        return res.status(404).json({ error: 'Trainer not found or not authorized' });
      }

      // Assign trainer to member
      await User.findByIdAndUpdate(memberId, {
        assignedTrainer: trainerId
      });

      res.json({ message: 'Trainer assigned to member successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to assign trainer' });
    }
  }
);

// Add the dashboard analytics endpoint for gym owners
router.get('/dashboard', 
  verifyToken, 
  permitRoles('gym-owner'),
  verifyApproved,
  async (req, res) => {
    try {
      const gymId = req.user.gymId;
      
      // Get count of members and trainers for this gym
      const [membersCount, trainersCount] = await Promise.all([
        User.countDocuments({ 
          gymId, 
          role: 'member'
        }),
        User.countDocuments({ 
          gymId, 
          role: 'trainer'
        })
      ]);
      
      // Get active memberships (paid and not expired)
      const activeMemberships = await Membership.countDocuments({
        gymId,
        status: 'active',
        expiryDate: { $gt: new Date() }
      });
      
      // Calculate monthly revenue from active memberships
      const memberships = await Membership.find({ 
        gymId, 
        status: 'active'
      });
      
      const monthlyRevenue = memberships.reduce((total, membership) => {
        return total + (membership.monthlyFee || 0);
      }, 0);
      
      // Get recent member dropouts (expired memberships in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const dropouts = await Membership.countDocuments({
        gymId,
        status: { $in: ['expired', 'cancelled'] },
        updatedAt: { $gte: thirtyDaysAgo }
      });
      
      // Get attendance data for the past 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const attendanceData = await Attendance.aggregate([
        {
          $match: {
            gymId,
            date: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      // Format attendance data for chart
      const attendanceGraph = [];
      const current = new Date(sevenDaysAgo);
      
      // Create an array with all 7 days
      for (let i = 0; i < 7; i++) {
        const dateStr = current.toISOString().split('T')[0];
        const found = attendanceData.find(item => item._id === dateStr);
        
        attendanceGraph.push({
          date: dateStr,
          count: found ? found.count : 0
        });
        
        current.setDate(current.getDate() + 1);
      }
      
      // Get new member signups this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      const newMembersThisMonth = await User.countDocuments({
        gymId,
        role: 'member',
        createdAt: { $gte: firstDayOfMonth }
      });
      
      // Calculate membership plan distribution
      const membershipTypes = await Membership.aggregate([
        {
          $match: { 
            gymId,
            status: 'active'
          }
        },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 }
          }
        }
      ]);
      
      const membershipDistribution = membershipTypes.map(type => ({
        type: type._id || 'Standard',
        count: type.count
      }));
      
      res.json({
        members: membersCount,
        trainers: trainersCount,
        activeMemberships,
        monthlyRevenue,
        dropouts,
        attendanceGraph,
        newMembersThisMonth,
        membershipDistribution
      });
    } catch (err) {
      console.error('Error fetching gym owner dashboard:', err);
      res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
});

module.exports = router; 