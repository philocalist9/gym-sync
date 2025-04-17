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
      // Make a request to the backend API
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
          'Content-Type': 'application/json'
        },
        // Increase timeout for slow connections
        timeout: 10000
      });

      console.log('Registration success response:', response.status);
      
      // Return the success response
      return res.status(response.status).json({
        message: 'Gym registration submitted successfully. You will be notified once approved by an admin.',
        ...response.data
      });
    } catch (backendError) {
      console.error('Backend API error:', backendError.message);
      
      // Handle connection errors differently in development vs production
      if (process.env.NODE_ENV === 'development' && 
          (backendError.code === 'ECONNREFUSED' || 
           backendError.message.includes('connect') || 
           backendError.message.includes('network'))) {
        
        console.log('Development mode: Returning mock success response');
        
        // In development, return a mock success response if backend is unreachable
        return res.status(200).json({
          message: 'DEV MODE: Gym registration submitted successfully (mock response).',
          mockData: true,
          userData: { name, email, role: 'gymOwner', gymName, location, phone }
        });
      }
      
      // For all other errors, pass through
      throw backendError;
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
    
    // Pass through backend error messages
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.message || 'An error occurred during gym registration'
      });
    }
    
    // Handle connection issues specifically
    if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
      return res.status(503).json({ 
        error: 'Unable to connect to the registration service. Please try again later.' 
      });
    }
    
    // Provide more specific timeout error
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      return res.status(504).json({ 
        error: 'The registration service is taking too long to respond. Please try again later.' 
      });
    }
    
    return res.status(500).json({ error: 'Server error during gym registration. Please try again later.' });
  }
} 