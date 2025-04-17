const clients = [
  { name: 'Rohit Sharma', email: 'rohit@gmail.com', goal: 'Fat Loss', plan: 'Cardio Plus', progress: 'Good' },
  { name: 'Karan Patel', email: 'karan@gmail.com', goal: 'Muscle Gain', plan: 'Strength Basic', progress: 'Excellent' },
  { name: 'Priya Desai', email: 'priya@gmail.com', goal: 'Athletic Performance', plan: 'Sports Conditioning', progress: 'Average' },
];

export default function ClientsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">👥 My Clients</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Total Clients</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{clients.length}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
          Add New Client
        </button>
      </div>
      
      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.email} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{client.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{client.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                client.progress === 'Excellent' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                  : client.progress === 'Good'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
              }`}>
                {client.progress}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border dark:border-gray-700 rounded p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Goal</p>
                <p className="font-medium text-gray-900 dark:text-white">{client.goal}</p>
              </div>
              <div className="border dark:border-gray-700 rounded p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
                <p className="font-medium text-gray-900 dark:text-white">{client.plan}</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded transition">
                View Progress
              </button>
              <button className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded transition">
                Manage Plan
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded transition">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 