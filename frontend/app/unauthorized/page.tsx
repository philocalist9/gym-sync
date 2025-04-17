"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDashboardPath } from '@/utils/auth';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const router = useRouter();

  // If user is logged in, prepare their dashboard link
  const dashboardLink = user ? getRoleDashboardPath(user.role) : '/';

  // Auto-redirect after 5 seconds if user is logged in
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        router.push(dashboardLink);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [user, dashboardLink, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please go back to your dashboard.
        </p>
        
        <div className="space-y-4">
          <Button
            asChild
            className="w-full"
          >
            <Link href={dashboardLink} className="flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="w-full"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
        
        {user && (
          <p className="mt-8 text-sm text-gray-500">
            Redirecting you automatically in 5 seconds...
          </p>
        )}
      </div>
    </div>
  );
} 