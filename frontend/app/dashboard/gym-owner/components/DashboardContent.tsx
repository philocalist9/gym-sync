"use client";

import { useState } from "react";
import { BarChart, Users, Dumbbell, DollarSign, RefreshCw } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Static data to ensure the component always renders
const staticStats = {
  totalMembers: 25,
  totalTrainers: 8,
  activeMembers: 18,
  membersByPlan: [
    { _id: "Basic", count: 10 },
    { _id: "Premium", count: 8 },
    { _id: "Standard", count: 7 }
  ]
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  link: string;
}

function StatCard({ title, value, icon, bgColor, link }: StatCardProps) {
  return (
    <Link href={link} className={`${bgColor} rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div>
          {icon}
        </div>
      </div>
    </Link>
  );
}

// Utility function to get color based on plan type
function getPlanColor(planName: string): string {
  const planColors: { [key: string]: string } = {
    'basic': 'bg-blue-500',
    'standard': 'bg-purple-500',
    'premium': 'bg-amber-500',
    'default': 'bg-gray-500'
  };
  return planColors[planName.toLowerCase()] || planColors.default;
}

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(false);
  const stats = staticStats;

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">🏋️‍♂️ Welcome, Gym Owner</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your gym's performance
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers} 
          icon={<Users className="h-8 w-8 text-blue-500" />}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
          link="/dashboard/gym-owner/members"
        />
        <StatCard 
          title="Active Members" 
          value={stats.activeMembers} 
          icon={<Users className="h-8 w-8 text-green-500" />}
          bgColor="bg-green-50 dark:bg-green-900/20"
          link="/dashboard/gym-owner/members"
        />
        <StatCard 
          title="Trainers" 
          value={stats.totalTrainers} 
          icon={<Dumbbell className="h-8 w-8 text-purple-500" />}
          bgColor="bg-purple-50 dark:bg-purple-900/20"
          link="/dashboard/gym-owner/trainers"
        />
        <StatCard 
          title="Plans" 
          value={stats.membersByPlan.length} 
          icon={<DollarSign className="h-8 w-8 text-amber-500" />}
          bgColor="bg-amber-50 dark:bg-amber-900/20"
          link="/dashboard/gym-owner/plans"
        />
      </div>

      {/* Membership Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Membership Distribution</h2>
            <BarChart className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {stats.membersByPlan.map((plan) => (
              <div key={plan._id || 'unknown'} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getPlanColor(plan._id)}`} />
                  <span className="capitalize">{plan._id || 'No Plan'}</span>
                </div>
                <span className="font-medium">{plan.count} members</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/gym-owner/members/add" 
              className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Add Member</span>
            </Link>
            <Link href="/dashboard/gym-owner/trainers/add" 
              className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <Dumbbell className="h-5 w-5 mr-2 text-purple-600" />
              <span className="font-medium">Add Trainer</span>
            </Link>
            <Link href="/dashboard/gym-owner/profile" 
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              <span className="font-medium">Edit Profile</span>
            </Link>
            <Link href="/dashboard/gym-owner/reports" 
              className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
              <BarChart className="h-5 w-5 mr-2 text-amber-600" />
              <span className="font-medium">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 