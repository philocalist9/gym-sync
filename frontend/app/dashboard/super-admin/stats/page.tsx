'use client';

import React from 'react';
import DashboardStats from '@/components/ui/DashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/shared/roles';

export default function SuperAdminStatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Protect the route
  React.useEffect(() => {
    if (!loading && user && user.role !== ROLES.SUPER_ADMIN) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Super Admin Statistics</h1>
      <DashboardStats />
    </div>
  );
} 