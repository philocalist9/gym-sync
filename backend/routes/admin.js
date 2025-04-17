const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, permitRoles } = require('../middleware/auth');

// Get all gym owners (for approval management)
router.get('/gym-owners', 
  verifyToken, 
  permitRoles('super-admin'),
  async (req, res) => {
    try {
      // Find all gym owners
      const owners = await User.find({ 
        role: 'gym-owner'
      }).select('-password');
      
      res.json(owners);
    } catch (err) {
      console.error('Error fetching gym owners:', err);
      res.status(500).json({ message: 'Server error fetching gym owners' });
    }
});

// Approve or reject a gym owner
router.post('/approve-owner', 
  verifyToken, 
  permitRoles('super-admin'),
  async (req, res) => {
    try {
      const { id, approve } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: 'Owner ID is required' });
      }
      
      // Find and update gym owner approval status
      const owner = await User.findOneAndUpdate(
        { _id: id, role: 'gym-owner' },
        { isApproved: approve },
        { new: true }
      ).select('-password');
      
      if (!owner) {
        return res.status(404).json({ message: 'Gym owner not found' });
      }
      
      res.json({
        message: approve ? 'Gym owner approved successfully' : 'Gym owner rejected',
        owner
      });
    } catch (err) {
      console.error('Error updating gym owner approval status:', err);
      res.status(500).json({ message: 'Server error updating approval status' });
    }
});

// Get system statistics
router.get('/stats', 
  verifyToken, 
  permitRoles('super-admin'),
  async (req, res) => {
    try {
      // Count users by role
      const totalMembers = await User.countDocuments({ role: 'member' });
      const totalTrainers = await User.countDocuments({ role: 'trainer' });
      const totalGymOwners = await User.countDocuments({ role: 'gym-owner' });
      const approvedGymOwners = await User.countDocuments({ 
        role: 'gym-owner',
        isApproved: true
      });
      const pendingGymOwners = await User.countDocuments({ 
        role: 'gym-owner',
        isApproved: false
      });
      
      // Get total users
      const totalUsers = totalMembers + totalTrainers + totalGymOwners;
      
      // Get recent gym owner registrations
      const recentRegistrations = await User.find({ 
        role: 'gym-owner',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // last 30 days
      })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
      
      res.json({
        totalUsers,
        totalMembers,
        totalTrainers,
        totalGymOwners,
        approvedGymOwners,
        pendingGymOwners,
        recentRegistrations
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      res.status(500).json({ message: 'Server error fetching statistics' });
    }
});

// Delete a gym owner (and all associated users)
router.delete('/owner/:id', 
  verifyToken, 
  permitRoles('super-admin'),
  async (req, res) => {
    try {
      const ownerId = req.params.id;
      
      // Find the gym owner
      const owner = await User.findOne({ 
        _id: ownerId,
        role: 'gym-owner'
      });
      
      if (!owner) {
        return res.status(404).json({ message: 'Gym owner not found' });
      }
      
      // Delete all users associated with this gym
      const gymId = owner.gymId || ownerId; // fallback to owner ID if gymId not set
      await User.deleteMany({ 
        gymId,
        role: { $in: ['member', 'trainer'] }
      });
      
      // Delete the gym owner
      await User.findByIdAndDelete(ownerId);
      
      res.json({ 
        message: 'Gym owner and all associated users deleted successfully' 
      });
    } catch (err) {
      console.error('Error deleting gym owner:', err);
      res.status(500).json({ message: 'Server error deleting gym owner' });
    }
});

// Add the dashboard analytics endpoint for super admins
router.get('/dashboard', 
  verifyToken, 
  permitRoles('super-admin'),
  async (req, res) => {
    try {
      // Get total counts for different user roles
      const [
        totalGymOwners, 
        totalTrainers, 
        totalMembers,
        pendingApprovals
      ] = await Promise.all([
        User.countDocuments({ role: 'gym-owner' }),
        User.countDocuments({ role: 'trainer' }),
        User.countDocuments({ role: 'member' }),
        User.countDocuments({ 
          role: 'gym-owner', 
          status: 'pending' 
        })
      ]);
      
      // Get recently registered gym owners (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentGyms = await User.find({
        role: 'gym-owner',
        createdAt: { $gte: thirtyDaysAgo }
      })
      .select('name email status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
      
      // Get gym registration trend over the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);
      
      const gymRegistrationTrend = await User.aggregate([
        {
          $match: {
            role: 'gym-owner',
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: { 
              month: { $month: "$createdAt" }, 
              year: { $year: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
      
      // Format trend data for chart with all months included
      const trendData = [];
      const currentDate = new Date(sixMonthsAgo);
      
      for (let i = 0; i < 6; i++) {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const found = gymRegistrationTrend.find(
          item => item._id.month === month && item._id.year === year
        );
        
        const monthNames = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        trendData.push({
          month: monthNames[month - 1],
          year: year,
          count: found ? found.count : 0
        });
        
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      // Get approval rate statistics 
      const totalProcessed = await User.countDocuments({
        role: 'gym-owner',
        status: { $in: ['approved', 'rejected'] }
      });
      
      const approvedCount = await User.countDocuments({
        role: 'gym-owner',
        status: 'approved'
      });
      
      const approvalRate = totalProcessed > 0 
        ? Math.round((approvedCount / totalProcessed) * 100) 
        : 0;
      
      // Get geographical distribution of gyms
      const geographicalDistribution = await User.aggregate([
        {
          $match: { role: 'gym-owner' }
        },
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      
      const locationData = geographicalDistribution.map(item => ({
        location: item._id || 'Unknown',
        count: item.count
      }));
      
      res.json({
        totalGymOwners,
        totalTrainers,
        totalMembers,
        pendingApprovals,
        recentGyms,
        registrationTrend: trendData,
        approvalRate,
        locationData
      });
    } catch (err) {
      console.error('Error fetching super admin dashboard:', err);
      res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
});

module.exports = router; 