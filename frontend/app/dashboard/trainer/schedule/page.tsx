'use client';
import { useState } from 'react';

// Sample schedule data
const scheduleData = [
  { id: 1, day: 'Monday', time: '10:00 - 11:00', client: 'Rohit Sharma', status: 'Confirmed' },
  { id: 2, day: 'Monday', time: '11:30 - 12:30', client: 'Neha Gupta', status: 'Confirmed' },
  { id: 3, day: 'Tuesday', time: '09:00 - 10:00', client: 'Karan Patel', status: 'Confirmed' },
  { id: 4, day: 'Tuesday', time: '14:00 - 15:00', client: null, status: 'Available' },
  { id: 5, day: 'Wednesday', time: '11:00 - 12:00', client: 'Priya Desai', status: 'Confirmed' },
  { id: 6, day: 'Thursday', time: '16:00 - 17:00', client: null, status: 'Available' },
  { id: 7, day: 'Friday', time: '10:00 - 11:00', client: 'Rohit Sharma', status: 'Pending' },
  { id: 8, day: 'Friday', time: '15:30 - 16:30', client: null, status: 'Available' }
];

// Group sessions by day
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const sessionsByDay = days.map(day => ({
  day,
  sessions: scheduleData.filter(session => session.day === day)
}));

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState('all');
  const [showAddSession, setShowAddSession] = useState(false);
  
  // Filter sessions based on selected day
  const filteredSessions = selectedDay === 'all' 
    ? scheduleData 
    : scheduleData.filter(session => session.day === selectedDay);
  
  // Count stats
  const confirmedCount = scheduleData.filter(s => s.status === 'Confirmed').length;
  const pendingCount = scheduleData.filter(s => s.status === 'Pending').length;
  const availableCount = scheduleData.filter(s => s.status === 'Available').length;
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">📆 My Schedule</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{scheduleData.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{confirmedCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400">Available Slots</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{availableCount}</p>
        </div>
      </div>
      
      {/* Filters and actions */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Day</label>
          <select 
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200"
          >
            <option value="all">All Days</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <button 
            onClick={() => setShowAddSession(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Add Available Slot
          </button>
        </div>
      </div>
      
      {/* Schedule table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Day</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Time</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Client</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-900 dark:text-gray-200">Status</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-900 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <tr key={session.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">{session.day}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">{session.time}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">
                    {session.client ? session.client : <span className="text-gray-500 dark:text-gray-400">-</span>}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs
                      ${session.status === 'Confirmed' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : session.status === 'Pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <button className="text-blue-600 dark:text-blue-400 hover:underline mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 dark:text-red-400 hover:underline">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No sessions found for the selected day.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Upcoming sessions */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Weekly Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {sessionsByDay.map(dayData => (
            <div key={dayData.day} className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{dayData.day}</h3>
              {dayData.sessions.length > 0 ? (
                <div className="space-y-2">
                  {dayData.sessions.map(session => (
                    <div key={session.id} className="text-sm">
                      <p className="text-gray-700 dark:text-gray-300">{session.time}</p>
                      <p className={`font-medium ${
                        session.client 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {session.client || 'Available'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No sessions</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 