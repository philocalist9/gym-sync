import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col space-y-3">
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Go to Home
          </Link>
          <Link 
            href="/login"
            className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
} 