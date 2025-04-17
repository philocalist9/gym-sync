import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email || !body.password || !body.role || !body.gymName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if email is taken (in a real app, this would check the database)
    if (body.email === 'taken@example.com') {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 409 }
      );
    }
    
    // Create user (in a real app, save to database)
    const user = {
      id: `user-${Date.now()}`,
      name: body.name,
      email: body.email,
      role: body.role,
      gymName: body.gymName,
      location: body.location || '',
      phone: body.phone || '',
      status: 'pending',
      isApproved: false,
      createdAt: new Date().toISOString()
    };
    
    // Generate token (in a real app, use JWT)
    const token = `mock-token-${user.id}`;
    
    // In a real app, we would not set cookies upon signup for gym owners,
    // because they need approval first. Only after approval would they be
    // able to log in and get tokens.
    
    // Return success response with user (excluding password)
    return NextResponse.json({
      message: 'Gym owner registration submitted successfully. Awaiting approval.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gymName: user.gymName,
        location: user.location,
        phone: user.phone,
        status: user.status,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed. Please try again.' },
      { status: 500 }
    );
  }
} 