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
router.get("/approvals", isSuperAdmin, superAdmin.getPendingOwners);

// Approve a gym owner
router.post("/approve/:id", isSuperAdmin, superAdmin.approveOwner);

// Reject a gym owner - Using POST to accept the reason parameter
router.post("/reject/:id", isSuperAdmin, superAdmin.rejectOwner);

// Reset a gym owner to pending status
router.put("/reset/:id", isSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedOwner = await require('../models/User').findByIdAndUpdate(
      id,
      { 
        status: 'pending',
        isApproved: false,
        approvedAt: null,
        approvedBy: null,
        rejectionReason: ''
      },
      { new: true }
    ).select('-password');
    
    if (!updatedOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    // Log the reset for auditing
    console.log(`Gym owner ${updatedOwner.email} (${updatedOwner._id}) reset to pending by admin ${req.user ? req.user.id : 'Unknown'}`);
    
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
router.get("/owners", isSuperAdmin, superAdmin.getApprovedOwners);

// Get system-wide statistics
router.get("/stats", isSuperAdmin, superAdmin.getStats);

module.exports = router; 