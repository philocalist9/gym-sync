/**
 * Middleware to check if user has the required role
 * @param {Array} roles - Array of allowed roles
 */
module.exports = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Convert database roles to lowercase for comparison
    const userRole = req.user.role.toLowerCase();
    
    // Map roles - we need to handle both formats (database and readable)
    const roleMap = {
      'member': 'member',
      'trainer': 'trainer',
      'gymowner': 'gymOwner',
      'gym owner': 'gymOwner',
      'superadmin': 'superAdmin',
      'super admin': 'superAdmin'
    };
    
    // Convert all roles to lowercase for case-insensitive comparison
    const normalizedRoles = roles.map(role => {
      const normalizedRole = role.toLowerCase();
      return roleMap[normalizedRole] || normalizedRole;
    });
    
    // Check if user's role is in the allowed roles
    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Unauthorized: Requires ${roles.join(' or ')} role` 
      });
    }
    
    next();
  };
}; 