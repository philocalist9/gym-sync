import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Basic validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Mock authentication logic
    // In a real app, you would verify credentials against a database
    let user = null;
    let token = null;
    
    if (body.email === 'member@example.com' && body.password === 'password') {
      user = { id: 'member-123', name: 'Test Member', email: body.email, role: 'member' };
      token = 'mock-token-member';
    } else if (body.email === 'trainer@example.com' && body.password === 'password') {
      user = { id: 'trainer-456', name: 'Test Trainer', email: body.email, role: 'trainer' };
      token = 'mock-token-trainer';
    } else if (body.email === 'owner@example.com' && body.password === 'password') {
      user = { id: 'owner-789', name: 'Test Owner', email: body.email, role: 'gym-owner' };
      token = 'mock-token-owner';
    } else if (body.email === 'admin@example.com' && body.password === 'password') {
      user = { id: 'admin-101', name: 'Test Admin', email: body.email, role: 'super-admin' };
      token = 'mock-token-admin';
    }
    
    if (!user || !token) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Set cookies
    cookies().set('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    cookies().set('role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      user,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
} 