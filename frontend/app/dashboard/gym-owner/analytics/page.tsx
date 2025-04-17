'use client';
import { useState, useEffect } from 'react';
import axios from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface RevenueData {
  month: string;
  amount: number;
}

interface MembershipStats {
  basic: number;
  standard: number;
  premium: number;
}

interface AttendanceData {
  day: string;
  count: number;
}

interface AnalyticsData {
  revenueData: RevenueData[];
  membershipStats: MembershipStats;
  attendanceData: AttendanceData[];
  totalMembers: number;
  totalTrainers: number;
  newTrainers: number;
  revenueGrowth: number;
  attendanceGrowth: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState('Monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenueData: [],
    membershipStats: { basic: 0, standard: 0, premium: 0 },
    attendanceData: [],
    totalMembers: 0,
    totalTrainers: 0,
    newTrainers: 0,
    revenueGrowth: 0,
    attendanceGrowth: 0
  });

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData(timeframe);
  }, [timeframe]);

  const fetchAnalyticsData = async (period: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/gym-owner/analytics?timeframe=${period.toLowerCase()}`);
      setAnalyticsData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data');
      
      // Check if user is not authorized
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error('Access denied. Redirecting to login...');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals and max values for scaling charts
  const totalRevenue = analyticsData.revenueData.reduce((sum, item) => sum + item.amount, 0);
  const totalMembers = analyticsData.totalMembers;
  const totalAttendance = analyticsData.attendanceData.reduce((sum, item) => sum + item.count, 0);
  const avgDailyAttendance = analyticsData.attendanceData.length 
    ? Math.round(totalAttendance / analyticsData.attendanceData.length) 
    : 0;
  
  // Calculate max values for scaling charts
  const maxRevenue = analyticsData.revenueData.length 
    ? Math.max(...analyticsData.revenueData.map(item => item.amount)) 
    : 0;
  const maxAttendance = analyticsData.attendanceData.length 
    ? Math.max(...analyticsData.attendanceData.map(item => item.count)) 
    : 0;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">📊 Gym Analytics</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        View detailed metrics about your gym's performance
      </p>
      
      {/* Time frame selector */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeframe('Weekly')}
            className={`px-4 py-2 rounded-full text-sm ${
              timeframe === 'Weekly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Weekly
          </button>
          <button 
            onClick={() => setTimeframe('Monthly')}
            className={`px-4 py-2 rounded-full text-sm ${
              timeframe === 'Monthly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeframe('Yearly')}
            className={`px-4 py-2 rounded-full text-sm ${
              timeframe === 'Yearly' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Yearly
          </button>
        </div>
        
        <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded text-sm w-full sm:w-auto">
          Export Report
        </button>
      </div>
      
      {/* Loading and Error States */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalMembers}</p>
              <p className={`text-xs ${analyticsData.revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {analyticsData.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.revenueGrowth)}% from last period
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Trainers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.totalTrainers}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                ↑ {analyticsData.newTrainers} new this period
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{totalRevenue >= 100000 ? (totalRevenue/100000).toFixed(1) + 'L' : (totalRevenue/1000).toFixed(0) + 'K'}
              </p>
              <p className={`text-xs ${analyticsData.revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {analyticsData.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.revenueGrowth)}% from previous period
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Daily Attendance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{avgDailyAttendance}</p>
              <p className={`text-xs ${analyticsData.attendanceGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {analyticsData.attendanceGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.attendanceGrowth)} from last period
              </p>
            </div>
          </div>
          
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revenue Trends</h2>
            
            {analyticsData.revenueData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No revenue data available for this period.</p>
              </div>
            ) : (
              <div className="h-60">
                <div className="flex h-full">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between text-xs text-gray-500 pr-2">
                    <span>₹{maxRevenue.toLocaleString()}</span>
                    <span>₹{Math.round(maxRevenue/2).toLocaleString()}</span>
                    <span>₹0</span>
                  </div>
                  
                  {/* Chart */}
                  <div className="flex-1 relative">
                    <div className="absolute left-0 right-0 top-0 bottom-0 border-b border-l border-gray-300 dark:border-gray-700">
                      <div className="absolute left-0 right-0 top-0 bottom-0 flex items-end">
                        {analyticsData.revenueData.map((item, index) => {
                          const heightPercentage = maxRevenue > 0 ? (item.amount / maxRevenue) * 100 : 0;
                          
                          return (
                            <div 
                              key={index} 
                              className="flex-1 flex flex-col items-center"
                            >
                              <div 
                                className="w-4/5 bg-blue-500 dark:bg-blue-600 rounded-t"
                                style={{ height: `${heightPercentage}%` }}
                              ></div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Membership and Attendance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Membership Distribution */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Membership Distribution</h2>
              
              {totalMembers === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No membership data available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Basic (₹999/month)</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{analyticsData.membershipStats.basic} members</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${totalMembers > 0 ? (analyticsData.membershipStats.basic / totalMembers) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Standard (₹1,999/month)</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{analyticsData.membershipStats.standard} members</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${totalMembers > 0 ? (analyticsData.membershipStats.standard / totalMembers) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Premium (₹2,999/month)</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{analyticsData.membershipStats.premium} members</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${totalMembers > 0 ? (analyticsData.membershipStats.premium / totalMembers) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  
                  {analyticsData.membershipStats.premium > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <span className="font-medium">Insight:</span> {
                          analyticsData.membershipStats.premium < analyticsData.membershipStats.standard * 0.5
                          ? "Consider promoting Standard to Premium upgrades with special offers."
                          : "Your premium plan is performing well! Consider adding more exclusive benefits to maintain retention."
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Weekly Attendance */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Attendance</h2>
              
              {analyticsData.attendanceData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No attendance data available for this period.</p>
                </div>
              ) : (
                <div className="h-48">
                  <div className="flex h-full">
                    {/* Y-axis */}
                    <div className="flex flex-col justify-between text-xs text-gray-500 pr-2">
                      <span>{maxAttendance}</span>
                      <span>{Math.round(maxAttendance/2)}</span>
                      <span>0</span>
                    </div>
                    
                    {/* Chart */}
                    <div className="flex-1 relative">
                      <div className="absolute left-0 right-0 top-0 bottom-0 border-b border-l border-gray-300 dark:border-gray-700">
                        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-end">
                          {analyticsData.attendanceData.map((item, index) => {
                            const heightPercentage = maxAttendance > 0 ? (item.count / maxAttendance) * 100 : 0;
                            
                            return (
                              <div 
                                key={index} 
                                className="flex-1 flex flex-col items-center"
                              >
                                <div 
                                  className={`w-4/5 rounded-t ${
                                    item.day === 'Sat' || item.day === 'Sun' ? 'bg-green-500 dark:bg-green-600' : 'bg-purple-500 dark:bg-purple-600'
                                  }`}
                                  style={{ height: `${heightPercentage}%` }}
                                ></div>
                                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.day}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {analyticsData.attendanceData.length > 0 && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    <span className="font-medium">Insight:</span> {
                      (analyticsData.attendanceData.find(item => item.day === 'Sat' || item.day === 'Sun')?.count || 0) >=
                      Math.max(...analyticsData.attendanceData.filter(item => item.day !== 'Sat' && item.day !== 'Sun').map(item => item.count), 0)
                      ? "Weekends are your busiest days. Consider adding more classes during peak hours."
                      : "Weekday traffic is strong. Consider offering early morning and evening classes to accommodate work schedules."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 