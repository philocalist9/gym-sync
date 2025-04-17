const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token middleware
exports.verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with the id in the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Set user data in request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is a member
exports.isMember = (req, res, next) => {
  if (req.user.role !== 'member') {
    return res.status(403).json({ message: 'Access denied: Member only' });
  }
  next();
};

// Check if user is a trainer
exports.isTrainer = (req, res, next) => {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({ message: 'Access denied: Trainer only' });
  }
  next();
};

// Check if user is a gym owner
exports.isGymOwner = (req, res, next) => {
  if (req.user.role !== 'gym-owner') {
    return res.status(403).json({ message: 'Access denied: Gym Owner only' });
  }
  
  // Check if gym owner is approved
  if (!req.user.isApproved) {
    return res.status(403).json({ message: 'Your gym owner account is pending approval' });
  }
  
  next();
};

// Check if user is a super admin
exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({ message: 'Access denied: Super Admin only' });
  }
  next();
};

// Check if user is a trainer or gym owner
exports.isTrainerOrGymOwner = (req, res, next) => {
  if (req.user.role !== 'trainer' && req.user.role !== 'gym-owner') {
    return res.status(403).json({ message: 'Access denied: Trainer or Gym Owner only' });
  }
  
  // If gym owner, check if approved
  if (req.user.role === 'gym-owner' && !req.user.isApproved) {
    return res.status(403).json({ message: 'Your gym owner account is pending approval' });
  }
  
  next();
}; 