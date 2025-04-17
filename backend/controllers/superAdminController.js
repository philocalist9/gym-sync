const User = require('../models/User');

// Get all pending gym owner approvals
exports.getPendingOwners = async (req, res) => {
  try {
    const pendingOwners = await User.find({ 
      role: 'gymOwner',
      status: 'pending'
    }).select('-password');
    
    res.status(200).json(pendingOwners);
  } catch (error) {
    console.error('Error fetching pending owners:', error);
    res.status(500).json({ message: 'Failed to fetch pending gym owners' });
  }
};

// Approve a gym owner
exports.approveOwner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedOwner = await User.findByIdAndUpdate(
      id,
      { 
        status: 'approved',
        isApproved: true
      },
      { new: true }
    ).select('-password');
    
    if (!updatedOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    res.status(200).json({ 
      message: 'Gym owner approved successfully',
      owner: updatedOwner
    });
  } catch (error) {
    console.error('Error approving gym owner:', error);
    res.status(500).json({ message: 'Failed to approve gym owner' });
  }
};

// Reject a gym owner
exports.rejectOwner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedOwner = await User.findByIdAndUpdate(
      id,
      { 
        status: 'rejected',
        isApproved: false
      },
      { new: true }
    ).select('-password');
    
    if (!updatedOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    res.status(200).json({ 
      message: 'Gym owner rejected successfully',
      owner: updatedOwner
    });
  } catch (error) {
    console.error('Error rejecting gym owner:', error);
    res.status(500).json({ message: 'Failed to reject gym owner' });
  }
};

// Get all approved gym owners
exports.getApprovedOwners = async (req, res) => {
  try {
    const approvedOwners = await User.find({ 
      role: 'gymOwner',
      status: 'approved'
    }).select('-password');
    
    res.status(200).json(approvedOwners);
  } catch (error) {
    console.error('Error fetching approved owners:', error);
    res.status(500).json({ message: 'Failed to fetch approved gym owners' });
  }
};

// Get system-wide statistics
exports.getStats = async (req, res) => {
  try {
    const totalOwners = await User.countDocuments({ role: 'gymOwner' });
    const pendingOwners = await User.countDocuments({ role: 'gymOwner', status: 'pending' });
    const approvedOwners = await User.countDocuments({ role: 'gymOwner', status: 'approved' });
    const rejectedOwners = await User.countDocuments({ role: 'gymOwner', status: 'rejected' });
    
    res.status(200).json({
      totalOwners,
      pendingOwners,
      approvedOwners,
      rejectedOwners
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
}; 