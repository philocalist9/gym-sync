// Mock signup API endpoint for development testing

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
      return res.status(400).json({ error: 'Gym name is required for gym registration.' });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for existing email (mock validation)
    if (email === 'taken@example.com') {
      return res.status(400).json({ error: 'This email is already registered. Please use a different email.' });
    }

    // Return a successful response
    return res.status(201).json({
      message: 'Gym registration submitted successfully. You will be notified once approved by an admin.',
      success: true,
      mockData: true,
      user: {
        id: `mock-${Date.now()}`,
        name,
        email,
        role: 'gymOwner',
        gymName,
        status: 'pending',
        isApproved: false,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Mock signup error:', error);
    return res.status(500).json({ error: 'Server error during mock registration process.' });
  }
} 