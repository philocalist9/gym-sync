const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and validates it
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if it's a mock token for development purposes
    if (token.startsWith('mock-token-')) {
      // Extract user ID from mock token
      const userId = token.split('mock-token-')[1];
      
      // Add user to request object
      req.user = { 
        id: `mock-id-${userId}`,
        role: userId // The role is the userId for mock tokens
      };
      
      return next();
    }
    
    // Verify actual token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Middleware to check if user has one of the allowed roles
 * Usage: permitRoles("admin", "gym-owner")
 */
const permitRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Make sure verifyToken was called first
    if (!req.user) {
      return res.status(500).json({ message: "Server error: User authentication not performed" });
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied: Your role does not have permission for this resource" 
      });
    }

    next();
  };
};

/**
 * Middleware to verify gym owner is approved
 * Use this for gym owner endpoints to ensure they're approved
 */
const verifyApproved = async (req, res, next) => {
  try {
    // Make sure verifyToken was called first
    if (!req.user) {
      return res.status(500).json({ message: "Server error: User authentication not performed" });
    }

    // Only check for gym owners
    if (req.user.role === 'gym-owner') {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!user.isApproved) {
        return res.status(403).json({ 
          message: "Your account is pending approval by an administrator" 
        });
      }
    }

    next();
  } catch (err) {
    console.error("Approval verification failed:", err.message);
    return res.status(500).json({ message: "Server error checking approval status" });
  }
};

/**
 * Middleware to verify resource ownership
 * Checks if the user is accessing their own resources or has admin privileges
 */
const verifyOwnership = (modelType) => {
  return async (req, res, next) => {
    try {
      // Admin can access any resource
      if (req.user.role === 'super-admin') {
        return next();
      }

      const resourceId = req.params.id;
      
      // If no resource ID provided
      if (!resourceId) {
        return next();
      }

      // Use different logic based on model type
      switch (modelType) {
        case 'member':
          // Trainers can access their assigned members
          if (req.user.role === 'trainer') {
            const member = await User.findById(resourceId);
            if (member && member.trainerId && member.trainerId.toString() === req.user.userId) {
              return next();
            }
          }
          break;
          
        case 'trainer':
          // Gym owners can access their trainers
          if (req.user.role === 'gym-owner') {
            const trainer = await User.findById(resourceId);
            if (trainer && trainer.gymId && trainer.gymId.toString() === req.user.gymId) {
              return next();
            }
          }
          break;
          
        // Add more cases as needed
      }

      // For all other cases, check if user is accessing their own resource
      if (resourceId === req.user.userId) {
        return next();
      }

      return res.status(403).json({ message: "You don't have permission to access this resource" });
    } catch (err) {
      console.error("Ownership verification failed:", err.message);
      return res.status(500).json({ message: "Server error checking resource ownership" });
    }
  };
};

module.exports = { 
  verifyToken, 
  permitRoles,
  verifyApproved,
  verifyOwnership
}; 