const workouts = [
  { day: 'Monday', status: '✅ Completed' },
  { day: 'Tuesday', status: '⏳ Upcoming' },
  { day: 'Wednesday', status: '❌ Skipped' },
];

export default function WorkoutsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">💪 My Workouts</h1>
      <div className="space-y-3">
        {workouts.map((w) => (
          <div key={w.day} className="bg-white dark:bg-slate-800 p-4 rounded shadow">
            <p className="text-gray-800 dark:text-gray-200"><strong>{w.day}</strong>: {w.status}</p>
            <button className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
              Mark as Completed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 