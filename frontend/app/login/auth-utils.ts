/**
 * Utility functions for authentication
 */

/**
 * Sets authentication cookies after successful login
 */
export function setAuthCookies(token: string, role: string): void {
  document.cookie = `token=${token}; path=/`;
  document.cookie = `role=${role}; path=/`;
  
  // Also set in localStorage for Pages Router components
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
}

/**
 * Clears authentication cookies on logout
 */
export function clearAuthCookies(): void {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Also clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

/**
 * Gets a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getCookie('token');
}

/**
 * Get the current user role
 */
export function getUserRole(): string | null {
  console.log("Checking for user role...");
  
  // Try to get role from cookie first
  let role = getCookie('role');
  console.log("Role from cookie:", role);
  
  // If no role in cookie, try localStorage
  if (!role) {
    role = localStorage.getItem('role');
    console.log("Role from localStorage directly:", role);
  }
  
  // If still no role, check user object in localStorage
  if (!role) {
    try {
      const userStr = localStorage.getItem('user');
      console.log("User from localStorage:", userStr);
      
      if (userStr) {
        const user = JSON.parse(userStr);
        role = user.role;
        console.log("Role from user object:", role);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }
  
  return role;
} 