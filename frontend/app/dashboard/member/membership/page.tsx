export default function MembershipPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">💳 Membership</h1>
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">Muscle Gain - Intermediate</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded text-sm">
            Active
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <p className="py-1"><strong>Duration:</strong> 3 Months</p>
          <p className="py-1"><strong>Started:</strong> April 15, 2025</p>
          <p className="py-1"><strong>Expires:</strong> July 15, 2025</p>
          <p className="py-1"><strong>Price:</strong> $199</p>
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Days Remaining</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
            Renew Plan
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
            <p className="font-medium text-lg">Weight Loss</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Focused on cardio and diet management</p>
            <p className="font-bold">$149 / 3 months</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded shadow border-2 border-blue-500">
            <p className="font-medium text-lg">Muscle Gain</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Strength training with progressive overload</p>
            <p className="font-bold">$199 / 3 months</p>
            <span className="inline-block mt-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
              Current Plan
            </span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
            <p className="font-medium text-lg">Athletic Performance</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Sport-specific training and conditioning</p>
            <p className="font-bold">$249 / 3 months</p>
          </div>
        </div>
      </div>
    </div>
  );
} 