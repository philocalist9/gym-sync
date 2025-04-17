'use client';
import { useState } from 'react';

interface Client {
  id: number;
  name: string;
  goal: string;
}

interface ProgressData {
  week: string;
  weight: number;
  bodyFat: number;
  strength: number;
}

const clients: Client[] = [
  { id: 1, name: 'Rohit Sharma', goal: 'Fat Loss' },
  { id: 2, name: 'Karan Patel', goal: 'Muscle Gain' },
  { id: 3, name: 'Priya Desai', goal: 'Athletic Performance' },
];

const progressData: ProgressData[] = [
  { week: 'Week 1', weight: 70, bodyFat: 22, strength: 65 },
  { week: 'Week 2', weight: 69.5, bodyFat: 21.2, strength: 68 },
  { week: 'Week 3', weight: 68.8, bodyFat: 20.5, strength: 72 },
  { week: 'Week 4', weight: 68, bodyFat: 19.8, strength: 75 },
  { week: 'Week 5', weight: 67.5, bodyFat: 19, strength: 78 },
  { week: 'Week 6', weight: 67.2, bodyFat: 18.5, strength: 82 },
  { week: 'Week 7', weight: 67, bodyFat: 18, strength: 85 },
];

type MetricType = 'weight' | 'bodyFat' | 'strength';

export default function TrainerProgressPage() {
  const [selectedClient, setSelectedClient] = useState<number>(1);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('weight');
  
  // Find the min and max values for scaling
  const data = progressData.map(item => item[selectedMetric]);
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue;
  
  // Calculate progress change
  const startValue = progressData[0][selectedMetric];
  const currentValue = progressData[progressData.length - 1][selectedMetric];
  const change = currentValue - startValue;
  const percentChange = ((change / startValue) * 100).toFixed(1);
  
  const client = clients.find(c => c.id === selectedClient);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">📊 Client Progress</h1>
      
      {/* Client selector */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Client
        </label>
        <select 
          value={selectedClient}
          onChange={(e) => setSelectedClient(Number(e.target.value))}
          className="w-full md:w-64 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200"
        >
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name} ({client.goal})</option>
          ))}
        </select>
      </div>
      
      {/* Client stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Weight</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentValue} kg</p>
          <p className={`text-sm ${change < 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change < 0 ? '↓' : '↑'} {Math.abs(change)} kg ({Math.abs(parseFloat(percentChange))}%)
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Body Fat</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressData[progressData.length - 1].bodyFat}%</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            ↓ {(progressData[0].bodyFat - progressData[progressData.length - 1].bodyFat).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Strength Index</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressData[progressData.length - 1].strength}</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            ↑ {progressData[progressData.length - 1].strength - progressData[0].strength} pts
          </p>
        </div>
      </div>
      
      {/* Progress chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Progress Chart</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedMetric('weight')}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedMetric === 'weight' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}
            >
              Weight
            </button>
            <button 
              onClick={() => setSelectedMetric('bodyFat')}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedMetric === 'bodyFat' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}
            >
              Body Fat
            </button>
            <button 
              onClick={() => setSelectedMetric('strength')}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedMetric === 'strength' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}
            >
              Strength
            </button>
          </div>
        </div>
        
        <div className="relative h-60 mt-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between">
            <span className="text-xs text-gray-500">{maxValue} {selectedMetric === 'bodyFat' ? '%' : selectedMetric === 'weight' ? 'kg' : ''}</span>
            <span className="text-xs text-gray-500">{minValue} {selectedMetric === 'bodyFat' ? '%' : selectedMetric === 'weight' ? 'kg' : ''}</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-10 border-b border-l border-gray-300 dark:border-gray-700 h-full relative">
            <div className="absolute left-0 right-0 bottom-0 flex justify-between">
              {progressData.map((item, index) => {
                // Calculate height percentage based on selected metric
                const value = item[selectedMetric];
                const heightPercentage = range === 0 ? 50 : ((value - minValue) / range) * 80;
                
                return (
                  <div key={index} className="flex flex-col items-center" style={{ height: '100%', width: `${100 / progressData.length}%` }}>
                    {/* Bar */}
                    <div className={`w-6 rounded-t ${selectedMetric === 'weight' ? 'bg-blue-500 dark:bg-blue-600' : selectedMetric === 'bodyFat' ? 'bg-red-500 dark:bg-red-600' : 'bg-green-500 dark:bg-green-600'}`} 
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
      
      {/* Client assessment */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assessment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Progress Summary</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {client?.name} is making {Math.abs(parseFloat(percentChange)) > 5 ? 'excellent' : 'good'} progress towards their {client?.goal} goal. 
              {selectedMetric === 'weight' && client?.goal === 'Fat Loss' 
                ? ' Weight loss is consistent and at a healthy rate.' 
                : ' Measurements are trending in the right direction.'}
            </p>
            
            <div className="flex items-center mb-2">
              <span className="w-20 text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded text-sm">
                On Track ✅
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="w-20 text-sm text-gray-600 dark:text-gray-400">Adherence:</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: '87%' }}></div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">87%</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Notes & Recommendations</h3>
            <textarea 
              className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 min-h-[120px]"
              defaultValue="Client shows high motivation levels. Consider increasing workout intensity by 10% next week. Diet adherence is good, but recommend increasing protein intake slightly."
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 