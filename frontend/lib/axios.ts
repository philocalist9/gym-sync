import axios from 'axios';

// Use environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increase timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Get the original request config
    const originalRequest = error.config;
    
    // Log the error but handle it gracefully
    console.error('API request failed:', error.message || 'Unknown error');
    
    // Handle auth endpoints specially - don't suppress these errors
    if (originalRequest?.url?.includes('/auth/')) {
      // For auth endpoints, let the error propagate to the components
      return Promise.reject(error);
    }
    
    // For common error cases, return a resolved promise with empty data
    if (
      error.message === 'Network Error' || 
      error.code === 'ECONNABORTED' ||
      (error.response && error.response.status >= 500) ||
      !navigator.onLine
    ) {
      console.log('Returning empty data for failed request');
      
      // Return a standard structure based on the URL path
      if (originalRequest?.url?.includes('/notifications')) {
        return Promise.resolve({ 
          data: { 
            success: false, 
            notifications: [] 
          } 
        });
      }
      
      // For other API endpoints, return a generic empty success response
      return Promise.resolve({ 
        data: { 
          success: false,
          message: 'Service temporarily unavailable'
        } 
      });
    }
    
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 