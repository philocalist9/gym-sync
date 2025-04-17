/**
 * Re-export auth utilities from the App Router auth-utils file
 * This file exists to provide compatibility for the Pages Router components
 */

export { 
  setAuthCookies,
  clearAuthCookies,
  getCookie,
  isAuthenticated,
  getUserRole
} from "../app/login/auth-utils";
