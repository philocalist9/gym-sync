const express = require("express");
const router = express.Router();
const superAdmin = require("../controllers/superAdminController");

// Middleware to check if user is super-admin
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superAdmin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Super Admin privileges required" });
  }
};

// Get all pending gym owner approvals
router.get("/approvals", superAdmin.getPendingOwners);

// Approve a gym owner
router.post("/approve/:id", superAdmin.approveOwner);

// Reject a gym owner
router.delete("/reject/:id", superAdmin.rejectOwner);

// Reset a gym owner to pending status
router.put("/reset/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedOwner = await require('../models/User').findByIdAndUpdate(
      id,
      { 
        status: 'pending',
        isApproved: false
      },
      { new: true }
    ).select('-password');
    
    if (!updatedOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    res.status(200).json({ 
      message: 'Gym owner status reset successfully',
      owner: updatedOwner
    });
  } catch (error) {
    console.error('Error resetting gym owner status:', error);
    res.status(500).json({ message: 'Failed to reset gym owner status' });
  }
});

// Get all approved gym owners
router.get("/owners", superAdmin.getApprovedOwners);

// Get system-wide statistics
router.get("/stats", superAdmin.getStats);

module.exports = router; 