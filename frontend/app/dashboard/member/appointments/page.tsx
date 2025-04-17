export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">📅 My Appointments</h1>
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow">
        <p className="text-gray-700 dark:text-gray-300 mb-2">You don't have any upcoming sessions.</p>
        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          Book a Session
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Available Trainers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded shadow flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">👨‍🏫</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">John Smith</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bodybuilding Specialist</p>
              <button className="mt-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded transition">
                View Schedule
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded shadow flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <span className="text-xl">👩‍🏫</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Emily Johnson</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Yoga Instructor</p>
              <button className="mt-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded transition">
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 