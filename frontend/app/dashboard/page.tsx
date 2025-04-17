'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/shared/roles';
import { CircleOff } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const redirectUser = async () => {
      try {
        console.log("Dashboard: Attempting to redirect based on user role");
        
        // Try to get the role from various sources
        const getUserRole = () => {
          // Try localStorage first
          const localStorageRole = localStorage.getItem('role');
          if (localStorageRole) {
            console.log("Dashboard: Found role in localStorage:", localStorageRole);
            return localStorageRole;
          }
          
          // Then try from cookies
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          
          if (cookies.role) {
            console.log("Dashboard: Found role in cookies:", cookies.role);
            return cookies.role;
          }
          
          // Try from user object
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const user = JSON.parse(userStr);
              if (user.role) {
                console.log("Dashboard: Found role in user object:", user.role);
                return user.role;
              }
            }
          } catch (err) {
            console.error("Error parsing user from localStorage:", err);
          }
          
          return null;
        };
        
        const role = getUserRole();
        
        // If no role is found, maybe we have a token but role is not properly set
        if (!role) {
          const token = localStorage.getItem('token');
          if (token) {
            console.log("Dashboard: Token exists but no role found, defaulting to Super Admin");
            // Default to super admin if we have a token but no role
            setTimeout(() => {
              window.location.href = '/dashboard/super-admin';
            }, 1000);
            return;
          } else {
            // No token and no role, redirect to login
            console.log("Dashboard: No authentication found, redirecting to login");
            setErrorMsg("No authentication found. Redirecting to login...");
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return;
          }
        }
        
        // Use setTimeout for reliability
        console.log("Dashboard: Redirecting to role dashboard:", role);
        setTimeout(() => {
          // Redirect based on role using direct URL navigation
          switch(role) {
            case ROLES.SUPER_ADMIN:
            case 'superAdmin':
              console.log("Dashboard: Redirecting to super admin dashboard");
              window.location.href = '/dashboard/super-admin';
              break;
            case ROLES.GYM_OWNER:
            case 'gymOwner':
              console.log("Dashboard: Redirecting to gym owner dashboard");
              window.location.href = '/dashboard/gym-owner';
              break;
            case ROLES.TRAINER:
            case 'trainer':
              console.log("Dashboard: Redirecting to trainer dashboard");
              window.location.href = '/dashboard/trainer';
              break;
            case ROLES.MEMBER:
            case 'member':
              console.log("Dashboard: Redirecting to member dashboard");
              window.location.href = '/dashboard/member';
              break;
            default:
              console.log("Dashboard: Unknown role:", role, "defaulting to super admin");
              // Default to super admin if unknown role
              window.location.href = '/dashboard/super-admin';
          }
        }, 100);
      } catch (err) {
        console.error("Dashboard: Error during redirection:", err);
        setErrorMsg("Error during redirection. Please try logging in again.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    redirectUser();
    
    // Countdown for fallback redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // If we're still here after countdown, force redirect to login
          window.location.href = '/login';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-lg shadow-md p-8 text-center">
        {errorMsg ? (
          <div className="flex flex-col items-center justify-center text-red-600 dark:text-red-400">
            <CircleOff className="h-12 w-12 mb-4" />
            <h1 className="text-xl font-semibold mb-2">{errorMsg}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Redirecting to login in {countdown} seconds...
            </p>
          </div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold mb-2">Redirecting to your dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we redirect you to the appropriate dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
} 