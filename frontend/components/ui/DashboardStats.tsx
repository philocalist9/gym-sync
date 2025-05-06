import React from 'react';
import { useStats } from '@/hooks/useStats';
import { Loader } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  className?: string;
}

const StatsCard = ({ title, value, className = '' }: StatsCardProps) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default function DashboardStats() {
  const { data, loading, error } = useStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
        <h3 className="font-medium">Failed to load statistics</h3>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Members" 
          value={data?.totalMembers || 0} 
          className="border-l-4 border-blue-500"
        />
        <StatsCard 
          title="Total Trainers" 
          value={data?.totalTrainers || 0} 
          className="border-l-4 border-green-500"
        />
        <StatsCard 
          title="Total Gym Owners" 
          value={data?.totalGymOwners || 0} 
          className="border-l-4 border-purple-500"
        />
        <StatsCard 
          title="Pending Approvals" 
          value={data?.pendingOwners || 0} 
          className="border-l-4 border-yellow-500"
        />
        <StatsCard 
          title="Approved Gyms" 
          value={data?.approvedOwners || 0} 
          className="border-l-4 border-emerald-500"
        />
        <StatsCard 
          title="Rejected Applications" 
          value={data?.rejectedOwners || 0} 
          className="border-l-4 border-red-500"
        />
      </div>
    </div>
  );
} 