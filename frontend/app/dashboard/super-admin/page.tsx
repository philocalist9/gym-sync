"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Users, 
  ShieldCheck, 
  ClipboardCheck, 
  BarChart2, 
  Settings,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/shared/roles';

// Dashboard statistic card component
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, description, icon, trend, trendValue, isLoading }: StatCardProps) => (
  <Card className="hover:shadow-md transition-all border border-gray-200 dark:border-gray-800">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-full">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </div>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

// Quick action card component
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const ActionCard = ({ title, description, icon, href, color }: ActionCardProps) => (
  <Link href={href} className="block">
    <Card className={`hover:shadow-md transition-all h-full border-l-4 ${color} hover:scale-[1.02]`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOwners: 0,
    pendingOwners: 0,
    approvedOwners: 0,
    rejectedOwners: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for proper authentication and role
  useEffect(() => {
    const validateAccess = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("SuperAdmin: No token found, redirecting to login");
        window.location.href = '/login';
        return false;
      }

      // Check if user has Super Admin role
      const role = localStorage.getItem('role');
      const userRole = user?.role || role;
      
      if (userRole !== 'superAdmin' && userRole !== ROLES.SUPER_ADMIN) {
        console.log("SuperAdmin: Not authorized, user role:", userRole);
        window.location.href = '/login';
        return false;
      }
      
      return true;
    };

    if (!validateAccess()) {
      return;
    }
  }, [user]);

  // Set default values after a timeout to prevent indefinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Stats fetch timeout - using fallback data");
        setStats({
          totalOwners: 14,
          pendingOwners: 3,
          approvedOwners: 10,
          rejectedOwners: 1
        });
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No auth token - setting fallback data');
          throw new Error('No authentication token found');
        }
        
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
        console.log(`Fetching stats from: ${apiBaseUrl}/api/superadmin/stats`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(`${apiBaseUrl}/api/superadmin/stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Stats data received:", data);
        setStats(data);
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        if (err.name === 'AbortError') {
          setError('Request timed out. Using default data.');
        } else {
          setError(err.message);
        }
        
        // Always use fallback data if there's an error
        setStats({
          totalOwners: 14,
          pendingOwners: 3,
          approvedOwners: 10,
          rejectedOwners: 1
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Super Admin'}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your fitness platform from a central location
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/dashboard/super-admin/settings">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading dashboard data</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Gym Owners" 
          value={stats.totalOwners}
          description="Total registered gym owners on platform" 
          icon={<Building className="h-4 w-4 text-blue-600" />}
          trend="up"
          trendValue="14% from last month"
          isLoading={loading}
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats.pendingOwners}
          description="Gym owner applications awaiting review" 
          icon={<ClipboardCheck className="h-4 w-4 text-yellow-600" />}
          isLoading={loading}
        />
        <StatCard 
          title="Approved Owners" 
          value={stats.approvedOwners}
          description="Active gym owners on the platform" 
          icon={<ShieldCheck className="h-4 w-4 text-green-600" />}
          trend="up"
          trendValue="5% from last month"
          isLoading={loading}
        />
        <StatCard 
          title="Rejected Applications" 
          value={stats.rejectedOwners}
          description="Applications that didn't meet criteria" 
          icon={<Users className="h-4 w-4 text-red-600" />}
          isLoading={loading}
        />
      </div>
      
      {/* Quick actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActionCard 
            title="Review Pending Approvals" 
            description={`${stats.pendingOwners || 'New'} gym owners awaiting your approval`}
            icon={<ClipboardCheck className="h-6 w-6 text-yellow-600" />}
            href="/dashboard/super-admin/approvals"
            color="border-yellow-500"
          />
          <ActionCard 
            title="Manage Gym Owners" 
            description="View and manage all registered gym owners"
            icon={<Building className="h-6 w-6 text-blue-600" />}
            href="/dashboard/super-admin/gym-owners"
            color="border-blue-500"
          />
          <ActionCard 
            title="View Analytics" 
            description="See platform performance metrics and trends"
            icon={<BarChart2 className="h-6 w-6 text-purple-600" />}
            href="/dashboard/super-admin/analytics"
            color="border-purple-500"
          />
        </div>
      </div>
      
      {/* Recent activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex gap-4 items-start pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 bg-green-100 rounded-full">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New gym owner approved</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">You approved FitLife Gym's application</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4 items-start pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">New application received</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">PowerFit Studios submitted a new application</p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-purple-100 rounded-full">
                  <BarChart2 className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Monthly report generated</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">June 2023 platform analytics are ready to view</p>
                  <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}