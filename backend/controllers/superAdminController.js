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
    const { notes } = req.body; // Optional notes about the approval
    
    // Get the super admin ID from the request (assuming auth middleware sets this)
    const superAdminId = req.user ? req.user.id : null;
    
    const updatedOwner = await User.findByIdAndUpdate(
      id,
      { 
        status: 'approved',
        isApproved: true,
        approvedAt: new Date(),
        approvedBy: superAdminId,
        rejectionReason: '' // Clear any previous rejection reason
      },
      { new: true }
    ).select('-password');
    
    if (!updatedOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    // Log the approval for auditing
    console.log(`Gym owner ${updatedOwner.email} (${updatedOwner._id}) approved by admin ${superAdminId || 'Unknown'}`);
    
    // TODO: Send email notification to the gym owner
    // This would be implemented with an email service
    
    // TODO: Create a notification in the system
    // This would use the notification system you have
    
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
    const { reason } = req.body; // Reason for rejection (required)
    
    // Validate that a reason was provided
    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    
    // Get the super admin ID from the request (assuming auth middleware sets this)
    const superAdminId = req.user ? req.user.id : null;
    
    const updatedOwner = await User.findByIdAndUpdate(
      id,
      { 
        status: 'rejected',
        isApproved: false,
        approvedAt: null, // Clear any previous approval date
        approvedBy: null, // Clear any previous approver
        rejectionReason: reason
      },
      { new: true }
    ).select('-password');
    
    if (!updatedOwner) {
      return res.status(404).json({ message: 'Gym owner not found' });
    }
    
    // Log the rejection for auditing
    console.log(`Gym owner ${updatedOwner.email} (${updatedOwner._id}) rejected by admin ${superAdminId || 'Unknown'}. Reason: ${reason}`);
    
    // TODO: Send email notification to the gym owner with the reason
    // This would be implemented with an email service
    
    // TODO: Create a notification in the system
    // This would use the notification system you have
    
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