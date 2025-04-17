'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '../../app/login/auth-utils';
import { ROLES } from '../../shared/roles';

export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Get role from localStorage or cookies
    try {
      const role = getUserRole();
      console.log('Dashboard redirect - Current role detected:', role);
      setUserRole(role);
      
      // Debug the stored user object
      const storedUser = localStorage.getItem('user');
      console.log('Stored user:', storedUser ? JSON.parse(storedUser) : 'None');
      
      // If running on client side
      if (typeof window !== 'undefined') {
        // Set a small delay to ensure hydration is complete
        setTimeout(() => {
          if (role === ROLES.SUPER_ADMIN || role === 'superAdmin') {
            console.log('Redirecting to super-admin dashboard...');
            document.location.href = '/dashboard/super-admin';
          } else if (role === ROLES.GYM_OWNER || role === 'gymOwner') {
            console.log('Redirecting to gym-owner dashboard...');
            document.location.href = '/dashboard/gym-owner';
          } else if (role === ROLES.TRAINER || role === 'trainer') {
            console.log('Redirecting to trainer dashboard...');
            document.location.href = '/dashboard/trainer';
          } else if (role === ROLES.MEMBER || role === 'member') {
            console.log('Redirecting to member dashboard...');
            document.location.href = '/dashboard/member';
          } else {
            // If no valid role, redirect to login
            console.log('No valid role found, redirecting to login...');
            document.location.href = '/login';
          }
        }, 100);
      }
    } catch (err) {
      console.error('Error in dashboard redirect:', err);
      setError('Error redirecting to dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 mb-2">Redirecting to your dashboard...</p>
        {userRole && <p className="text-sm text-gray-500">Detected role: {userRole}</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        
        <div className="mt-6">
          <button
            onClick={() => {
              // Clear credentials
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('user');
              
              // Clear cookies
              document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              
              // Redirect to login with parameter
              window.location.href = '/login?showLogin=true';
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            Logout / Clear Credentials
          </button>
        </div>
      </div>
    </div>
  );
} 