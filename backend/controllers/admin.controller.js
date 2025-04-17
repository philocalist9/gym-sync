const User = require('../models/User');

// Get all pending gym owner approvals
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingOwners = await User.find({ 
      role: "gymOwner", 
      status: "pending" 
    }).select('-password').sort({ createdAt: -1 });
    
    return res.status(200).json(pendingOwners);
  } catch (err) {
    console.error('Error fetching pending approvals:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Approve a gym owner
exports.approveGymOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const gymOwner = await User.findById(ownerId);
    
    if (!gymOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    if (gymOwner.role !== 'gymOwner') {
      return res.status(400).json({ message: 'User is not a gym owner' });
    }
    
    gymOwner.status = "approved";
    gymOwner.isApproved = true;
    await gymOwner.save();
    
    return res.status(200).json({ message: 'Gym owner approved successfully' });
  } catch (err) {
    console.error('Error approving gym owner:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reject a gym owner (delete their account)
exports.rejectGymOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const gymOwner = await User.findById(ownerId);
    
    if (!gymOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    if (gymOwner.role !== 'gymOwner') {
      return res.status(400).json({ message: 'User is not a gym owner' });
    }
    
    gymOwner.status = "rejected";
    gymOwner.isApproved = false;
    await gymOwner.save();
    
    return res.status(200).json({ message: 'Gym owner rejected' });
  } catch (err) {
    console.error('Error rejecting gym owner:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}; 