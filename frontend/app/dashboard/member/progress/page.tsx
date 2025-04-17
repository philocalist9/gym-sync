'use client';
import React from 'react';

const progressData = [
  { week: 'Week 1', weight: 62 },
  { week: 'Week 2', weight: 63 },
  { week: 'Week 3', weight: 63.5 },
  { week: 'Week 4', weight: 64 },
];

export default function ProgressPage() {
  // Find the min and max weights for scaling
  const minWeight = Math.min(...progressData.map(item => item.weight));
  const maxWeight = Math.max(...progressData.map(item => item.weight));
  const range = maxWeight - minWeight;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">📈 Progress Tracker</h1>
      
      {/* Simple chart visualization */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Weight Progress</h2>
        <div className="relative h-60 mt-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between">
            <span className="text-xs text-gray-500">{maxWeight} kg</span>
            <span className="text-xs text-gray-500">{minWeight} kg</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-10 border-b border-l border-gray-300 dark:border-gray-700 h-full relative">
            <div className="absolute left-0 right-0 bottom-0 flex justify-between">
              {progressData.map((item, index) => {
                // Calculate height percentage based on weight
                const heightPercentage = range === 0 ? 50 : ((item.weight - minWeight) / range) * 80;
                
                return (
                  <div key={index} className="flex flex-col items-center" style={{ height: '100%', width: `${100 / progressData.length}%` }}>
                    {/* Bar */}
                    <div className="w-6 bg-blue-500 dark:bg-blue-600 rounded-t" 
                         style={{ height: `${heightPercentage}%`, marginTop: 'auto' }}></div>
                    
                    {/* X-axis label */}
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">{item.week}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Starting Weight</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">62 kg</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Weight</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">64 kg</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Weight Gain</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">+2 kg</p>
        </div>
      </div>
      
      {/* Progress table */}
      <div className="mt-6 bg-white dark:bg-slate-800 rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700">
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Week</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Weight (kg)</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Change</th>
            </tr>
          </thead>
          <tbody>
            {progressData.map((item, index) => {
              const prevWeight = index > 0 ? progressData[index - 1].weight : item.weight;
              const change = item.weight - prevWeight;
              
              return (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">{item.week}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">{item.weight}</td>
                  <td className="py-3 px-4 text-sm">
                    {index === 0 ? (
                      <span className="text-gray-400">-</span>
                    ) : change > 0 ? (
                      <span className="text-green-600">+{change} kg</span>
                    ) : (
                      <span className="text-red-600">{change} kg</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 