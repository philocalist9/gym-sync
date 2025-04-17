"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { hasRole } from '@/utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string | string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth check is complete and user is not authenticated
    if (!loading) {
      // If user is not logged in, redirect to login
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // If roles are specified and user doesn't have required role, redirect
      if (allowedRoles && !hasRole(user.role, allowedRoles)) {
        // If user is logged in but doesn't have permission, redirect to unauthorized
        router.push('/unauthorized');
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user or wrong role (and still rendering), show nothing
  // Redirection will happen in the useEffect
  if (!user || (allowedRoles && !hasRole(user.role, allowedRoles))) {
    return null;
  }

  // User is authenticated and has correct role, show the protected content
  return <>{children}</>;
} 