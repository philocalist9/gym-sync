import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract the user data from the request
    const { name, email, password, gymName, location, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields. Please provide name, email, and password.' });
    }

    // Gym name is required
    if (!gymName) {
      return res.status(400).json({ error: 'Gym name is required for registration.' });
    }

    // Determine the API URL with better logging
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const apiEndpoint = `${apiBaseUrl}/api/auth/register`;
    
    console.log('Making gym owner registration request to:', apiEndpoint);

    try {
      // Make a request to the backend API with improved configuration
      const response = await axios.post(apiEndpoint, {
        name,
        email,
        password,
        role: 'gymOwner', // Always set role to gymOwner
        gymName,
        location,
        phone
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        },
        // Increase timeout for slow connections
        timeout: 15000,
        // Don't throw on non-2xx responses to handle them in the catch block
        validateStatus: null
      });

      // Log response details for debugging
      console.log('Registration API response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      // Handle various response statuses
      if (response.status >= 200 && response.status < 300) {
        return res.status(response.status).json({
          message: 'Gym registration submitted successfully. You will be notified once approved by an admin.',
          ...response.data
        });
      } else if (response.status === 400) {
        // Validation errors
        return res.status(400).json({
          error: response.data.message || 'Invalid registration data. Please check your information.'
        });
      } else if (response.status === 403) {
        // Permission errors
        return res.status(403).json({
          error: response.data.message || 'Unable to register. You may not have permission for this action.'
        });
      } else if (response.status === 409) {
        // Conflict (duplicate email)
        return res.status(409).json({
          error: response.data.message || 'This email is already registered. Please use a different email address.'
        });
      } else {
        // Other errors
        throw new Error(response.data.message || `API Error: ${response.status} ${response.statusText}`);
      }
    } catch (backendError) {
      console.error('Backend API error:', backendError.message);
      
      // Handle connection errors in development mode
      if (process.env.NODE_ENV === 'development' && 
          (backendError.code === 'ECONNREFUSED' || 
           backendError.message.includes('connect') || 
           backendError.message.includes('network'))) {
        
        console.log('Development mode: Redirecting to mock endpoint');
        
        // In development, redirect to mock signup
        return res.status(307).json({
          error: 'Unable to connect to backend API. Try using the mock signup endpoint for development testing.',
          useMockEndpoint: true
        });
      }
      
      // For all other errors, provide clear error message
      return res.status(500).json({
        error: backendError.response?.data?.message || 
               backendError.message || 
               'Server error during registration. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Gym owner signup API error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    
    // Handle specific error types with clear messages
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.message || 'An error occurred during gym registration'
      });
    }
    
    // Handle connection issues
    if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
      return res.status(503).json({ 
        error: 'Unable to connect to the registration service. Please try again later.' 
      });
    }
    
    // Handle timeout errors
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      return res.status(504).json({ 
        error: 'The registration service is taking too long to respond. Please try again later.' 
      });
    }
    
    // Generic error
    return res.status(500).json({ 
      error: 'Server error during gym registration. Please try again later.' 
    });
  }
} 