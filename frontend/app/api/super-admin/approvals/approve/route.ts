import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Get auth token from the request cookies
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Connect to MongoDB directly
      const client = await clientPromise;
      const db = client.db('gymsync');

      // Update the gym owner status to approved
      const result = await db.collection('gymOwners').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'approved' } }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Gym owner application not found' },
          { status: 404 }
        );
      }

      console.log('✅ APPROVED gym with ID:', id);

      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Application approved successfully'
      });
    } catch (dbError: any) {
      // Handle connection errors
      console.error('Database error when approving application:', dbError.message);
      
      // Return a more user-friendly response for connection errors
      return NextResponse.json(
        { 
          success: false, 
          message: 'Database connection error. The application was not approved.',
          networkError: true
        },
        { status: 503 } // Service Unavailable
      );
    }
  } catch (error: any) {
    console.error('Error approving application:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to approve application' 
      },
      { status: 500 }
    );
  }
} 