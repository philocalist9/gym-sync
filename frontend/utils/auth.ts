/**
 * Parse JWT token and extract payload
 */
export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing JWT token:', e);
    return null;
  }
}

/**
 * Get role dashboard path based on user role
 */
export function getRoleDashboardPath(role: string) {
  const rolePaths: Record<string, string> = {
    'member': '/member/dashboard',
    'trainer': '/trainer/dashboard',
    'gym-owner': '/dashboard/gym-owner',
    'super-admin': '/dashboard/super-admin',
  };

  return rolePaths[role] || '/';
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string | undefined, requiredRole: string | string[]): boolean {
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
} 