import { NextRequest, NextResponse } from 'next/server';
import { addGymOwner, getGymOwnerByEmail } from '@/lib/models/gymOwners';

export async function POST(request: NextRequest) {
  console.log("📡 API HIT: /api/signup-middleware");
  try {
    const data = await request.json();
    console.log("📄 Received signup data:", data);
    
    // Validate required fields
    const { name, email, gymName, phoneNumber, address } = data;
    
    if (!name || !email || !gymName || !phoneNumber || !address) {
      console.error("❌ Missing required fields:", { name, email, gymName, phoneNumber, address });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingOwner = await getGymOwnerByEmail(email);
    if (existingOwner) {
      console.error("❌ Email already registered:", email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    // Create new gym owner with pending status
    console.log("✅ Creating new gym owner application...");
    const newGymOwner = await addGymOwner({
      name,
      email,
      gymName,
      phoneNumber,
      address,
      description: data.description || '',
      status: 'pending'
    });
    
    console.log("✅ Gym owner application created successfully:", newGymOwner._id);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        name,
        email,
        gymName,
        status: 'pending'
      }
    });
  } catch (error: any) {
    console.error('❌ Error processing signup:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process signup',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 