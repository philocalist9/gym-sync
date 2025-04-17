'use client';

import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { ThemeToggle } from './ThemeToggle';
import { useEffect, useState } from 'react';
import { getCookie } from '../app/login/auth-utils';
import { ROLES } from '../shared/roles';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if a valid token exists, if not redirect to login
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("DashboardLayout: No token found, redirecting to login");
        window.location.href = '/login';
        return;
      }
    };

    checkAuth();
    
    // Determine user role from multiple sources
    const determineUserRole = () => {
      console.log("DashboardLayout: Determining user role");
      
      // First try from auth context
      if (user?.role) {
        console.log("DashboardLayout: Got role from auth context:", user.role);
        setRole(user.role);
        setUserName(user.name || 'User');
        return;
      }
      
      // Then try from cookie
      const cookieRole = getCookie('role');
      if (cookieRole) {
        console.log("DashboardLayout: Got role from cookie:", cookieRole);
        setRole(cookieRole);
      }
      
      // Then try from localStorage directly
      const localRole = localStorage.getItem('role');
      if (localRole && !cookieRole) {
        console.log("DashboardLayout: Got role from localStorage:", localRole);
        setRole(localRole);
      }
      
      // Finally try from user object in localStorage
      if (!user?.role && !cookieRole && !localRole) {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const parsedUser = JSON.parse(userStr);
            console.log("DashboardLayout: Got role from localStorage user object:", parsedUser.role);
            setRole(parsedUser.role);
            setUserName(parsedUser.name || 'User');
          } else {
            // No user data found, redirect to login
            console.log("DashboardLayout: No user data found, redirecting to login");
            window.location.href = '/login';
          }
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
          // Error in auth data, redirect to login
          window.location.href = '/login';
        }
      }
    };
    
    determineUserRole();
    
    // Handle responsive sidebar behavior
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [user]);

  // Format role for display
  const getDisplayRole = (roleValue: string | null) => {
    if (!roleValue) return '';
    
    switch(roleValue) {
      case 'superAdmin': return 'Super Admin';
      case 'gymOwner': return 'Gym Owner';
      case 'trainer': return 'Trainer';
      case 'member': return 'Member';
      default: return roleValue;
    }
  };

  // If still loading after 3 seconds, show a more detailed message
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  useEffect(() => {
    // Set a timeout to update the loading message if it takes too long
    if (!role) {
      const timeoutId = setTimeout(() => setLoadingTimeout(true), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [role]);

  // If role is still not determined, show loading
  if (!role) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="mb-2 text-gray-700 dark:text-gray-300">Loading dashboard...</p>
        
        {loadingTimeout && (
          <div className="max-w-md text-center mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 font-medium">Taking longer than expected</p>
            <p className="text-sm text-yellow-700 mt-1">
              If this persists, try refreshing the page or logging out and back in.
            </p>
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors mr-3"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-3 rounded-full bg-blue-600 text-white shadow-lg"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                      md:translate-x-0 transition-transform duration-300 fixed md:relative z-40 md:z-0 h-screen`}>
        <Sidebar role={role} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {getDisplayRole(role)} Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {userName || user?.name || 'User'}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 