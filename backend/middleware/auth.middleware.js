const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || "gymSyncSecret";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user is super-admin
const isSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Access denied: Super Admin privileges required' });
    }

    next();
  } catch (err) {
    console.error('Super admin check error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  verifyToken,
  isSuperAdmin
}; 