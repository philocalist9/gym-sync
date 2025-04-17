'use client';
import { useState } from 'react';

const existingPlans = [
  { 
    id: 1, 
    name: 'Beginner Strength', 
    type: 'Workout', 
    description: 'Basic strength training for beginners focusing on compound movements.', 
    duration: 8,
    assigned: 3
  },
  { 
    id: 2, 
    name: 'Fat Loss Diet', 
    type: 'Diet', 
    description: 'Calorie-deficit diet plan with high protein and moderate carbs.', 
    duration: 12,
    assigned: 1
  },
  { 
    id: 3, 
    name: 'Advanced Hypertrophy', 
    type: 'Workout', 
    description: 'High volume training for experienced lifters focusing on muscle growth.', 
    duration: 10,
    assigned: 0
  }
];

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [planType, setPlanType] = useState('workout');
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">📝 Workout & Diet Plans</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 ${
            activeTab === 'create' 
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Create New Plan
        </button>
        <button 
          onClick={() => setActiveTab('existing')}
          className={`px-4 py-2 ${
            activeTab === 'existing' 
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Existing Plans ({existingPlans.length})
        </button>
      </div>
      
      {activeTab === 'create' ? (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4 mb-6">
            <button 
              onClick={() => setPlanType('workout')}
              className={`px-4 py-2 rounded-full ${
                planType === 'workout' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
              }`}
            >
              Workout Plan
            </button>
            <button 
              onClick={() => setPlanType('diet')}
              className={`px-4 py-2 rounded-full ${
                planType === 'diet' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              }`}
            >
              Diet Plan
            </button>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan Name</label>
              <input 
                type="text" 
                placeholder={planType === 'workout' ? "e.g. Beginner Strength" : "e.g. Weight Loss Diet"} 
                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea 
                placeholder="Describe the plan, goals, and target audience" 
                className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 min-h-[100px]" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (weeks)</label>
                <input 
                  type="number" 
                  min="1" 
                  defaultValue="8" 
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
                <select className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            
            {planType === 'workout' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exercises</label>
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200" placeholder="Exercise Name" />
                    <input className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200" placeholder="Sets x Reps" />
                    <button className="bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-sm">Remove</button>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 mt-2 text-sm">+ Add Exercise</button>
                </div>
              </div>
            )}
            
            {planType === 'diet' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meal Plan</label>
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200" placeholder="Meal Name" />
                    <input className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200" placeholder="Calories" />
                  </div>
                  <textarea className="w-full mt-2 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200" placeholder="Meal Description" />
                  <button className="text-blue-600 dark:text-blue-400 mt-2 text-sm">+ Add Meal</button>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition">
                Save Plan
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {existingPlans.map(plan => (
            <div key={plan.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                    plan.type === 'Workout' 
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                      : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  }`}>
                    {plan.type}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">{plan.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.duration} weeks</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.assigned} client{plan.assigned !== 1 ? 's' : ''} assigned
                  </p>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Edit Plan</button>
                <button className="text-green-600 dark:text-green-400 hover:underline text-sm">Assign to Client</button>
                <button className="text-red-600 dark:text-red-400 hover:underline text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 