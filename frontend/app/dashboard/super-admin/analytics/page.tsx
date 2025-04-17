'use client';
import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Building2, Dumbbell, Activity, DollarSign } from 'lucide-react';
import { ReactNode } from 'react';
import Card from '@/components/ui/card';

// Sample data
const sampleStats = {
  gyms: 28,
  trainers: 124,
  members: 1678,
  pendingApprovals: 5,
  totalUsers: 1835,
  revenue: {
    current: 42500,
    previous: 38700,
    percentage: 9.8
  },
  activity: {
    logins: 756,
    activeUsers: 892,
    percentage: 12.3
  },
  recentRegistrations: [
    { _id: '1', name: 'Jessica Cooper', role: 'member', createdAt: new Date().toISOString() },
    { _id: '2', name: 'Michael Zhang', role: 'trainer', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: '3', name: 'Elite Fitness Center', role: 'gym-owner', createdAt: new Date(Date.now() - 172800000).toISOString() },
    { _id: '4', name: 'Sarah Johnson', role: 'member', createdAt: new Date(Date.now() - 259200000).toISOString() },
    { _id: '5', name: 'Robert Williams', role: 'trainer', createdAt: new Date(Date.now() - 345600000).toISOString() }
  ]
};

export default function SuperAnalyticsPage() {
  const [stats, setStats] = useState(sampleStats);
  const [period, setPeriod] = useState('month');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">📊 System Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor platform performance and key system metrics
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                period === 'week'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                period === 'month'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                period === 'year'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Gyms" 
          value={stats.gyms.toString()} 
          change={`+${stats.pendingApprovals}`} 
          period="pending"
          icon={<Building2 className="h-6 w-6 text-indigo-500" />}
          bgColor="bg-indigo-50 dark:bg-indigo-900/20" 
        />
        <StatCard 
          title="Trainers" 
          value={stats.trainers.toString()} 
          change="+14" 
          period="this month"
          icon={<Dumbbell className="h-6 w-6 text-purple-500" />}
          bgColor="bg-purple-50 dark:bg-purple-900/20" 
        />
        <StatCard 
          title="Members" 
          value={stats.members.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
          change="+86" 
          period="this month"
          icon={<Users className="h-6 w-6 text-blue-500" />}
          bgColor="bg-blue-50 dark:bg-blue-900/20" 
        />
        <StatCard 
          title="Revenue" 
          value={`$${stats.revenue.current.toLocaleString()}`}
          change={`+${stats.revenue.percentage}%`} 
          period="vs last month"
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
          bgColor="bg-green-50 dark:bg-green-900/20" 
        />
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard 
          title="User Growth" 
          description="Monthly user acquisition by role"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
          chart={
            <div className="h-64 w-full bg-gray-50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center p-4">
              <div className="w-full h-full relative">
                {/* Placeholder chart with mock bars */}
                <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-around">
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 rounded-t-md" style={{height: '40%'}}></div>
                    <span className="text-xs mt-2 text-gray-500">Jan</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 rounded-t-md" style={{height: '60%'}}></div>
                    <span className="text-xs mt-2 text-gray-500">Feb</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 rounded-t-md" style={{height: '45%'}}></div>
                    <span className="text-xs mt-2 text-gray-500">Mar</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 rounded-t-md" style={{height: '75%'}}></div>
                    <span className="text-xs mt-2 text-gray-500">Apr</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 rounded-t-md" style={{height: '90%'}}></div>
                    <span className="text-xs mt-2 text-gray-500">May</span>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <ChartCard 
          title="Platform Activity" 
          description="Daily active users and logins"
          icon={<Activity className="h-5 w-5 text-purple-500" />}
          chart={
            <div className="h-64 w-full bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="w-full h-full flex flex-col">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Active Users: {stats.activity.activeUsers}</span>
                  <span className="text-sm text-green-500">+{stats.activity.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Daily Logins: {stats.activity.logins}</span>
                  <span className="text-sm text-green-500">+8.3%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                {/* Placeholder line chart */}
                <div className="flex-1 mt-4 relative">
                  <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path d="M0,50 L10,45 L20,48 L30,40 L40,42 L50,30 L60,25 L70,20 L80,15 L90,10 L100,5" 
                          fill="none" 
                          stroke="#8B5CF6" 
                          strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DetailCard
          title="Top Performing Gyms"
          items={[
            { name: "FitZone Elite", value: "145 members" },
            { name: "UrbanFit Hub", value: "128 members" },
            { name: "ProFlex Gym", value: "102 members" },
            { name: "Power Athletics", value: "98 members" },
            { name: "CityFit Center", value: "87 members" },
          ]}
        />
        <DetailCard
          title="User Distribution"
          items={[
            { name: "Members", value: `${stats.members.toLocaleString()} (${Math.round((stats.members / stats.totalUsers) * 100)}%)` },
            { name: "Trainers", value: `${stats.trainers} (${Math.round((stats.trainers / stats.totalUsers) * 100)}%)` },
            { name: "Gym Owners", value: `${stats.gyms} (${Math.round((stats.gyms / stats.totalUsers) * 100)}%)` },
            { name: "Active Today", value: `${stats.activity.activeUsers} users` },
            { name: "Pending Approvals", value: `${stats.pendingApprovals}` },
          ]}
        />
        <DetailCard
          title="Recent Registrations"
          items={stats.recentRegistrations.map(user => ({
            name: user.name,
            value: `${user.role} - ${new Date(user.createdAt).toLocaleDateString()}`
          }))}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: ReactNode;
  bgColor: string;
}

function StatCard({ title, value, change, period, icon, bgColor }: StatCardProps) {
  const isPositive = change.startsWith('+');
  
  return (
    <Card className={`${bgColor} border border-gray-100 dark:border-gray-800/30 shadow-sm overflow-hidden`}>
      <Card.Content className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            <p className="text-3xl font-bold mt-2 mb-1">{value}</p>
            <p className="text-sm">
              <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {change}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                {period}
              </span>
            </p>
          </div>
          <div className="p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            {icon}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  chart: ReactNode;
}

function ChartCard({ title, description, icon, chart }: ChartCardProps) {
  return (
    <Card className="border border-gray-100 dark:border-gray-800/30 shadow-sm overflow-hidden">
      <Card.Content className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800/70 rounded-lg">
            {icon}
          </div>
        </div>
        <div>{chart}</div>
      </Card.Content>
    </Card>
  );
}

interface DetailItem {
  name: string;
  value: string;
}

interface DetailCardProps {
  title: string;
  items: DetailItem[];
}

function DetailCard({ title, items }: DetailCardProps) {
  return (
    <Card className="border border-gray-100 dark:border-gray-800/30 shadow-sm overflow-hidden">
      <Card.Content className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800/30 last:border-0">
              <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
              <span className="font-medium">{item.value}</span>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
} 