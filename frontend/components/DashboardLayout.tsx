'use client';

import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
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
          }
        } catch (err) {
          console.error("Error parsing user from localStorage:", err);
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

  // If role is still not determined, show loading
  if (!role) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading dashboard...</p>
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