import { NextRequest, NextResponse } from 'next/server';
import { updateGymOwnerStatus, getGymOwnerById } from '@/lib/models/gymOwners';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("📡 API HIT: /api/super-admin/approvals/reject/[id]");
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing account ID' },
        { status: 400 }
      );
    }
    
    console.log("🔍 Rejecting gym owner with ID:", id);
    
    // Check if the gym owner exists
    const owner = await getGymOwnerById(id);
    if (!owner) {
      console.error("❌ Gym owner not found with ID:", id);
      return NextResponse.json(
        { error: 'Gym owner not found' },
        { status: 404 }
      );
    }
    
    // Update the status to rejected
    console.log("✅ Gym owner found, updating status to rejected...");
    const updatedOwner = await updateGymOwnerStatus(id, 'rejected');
    
    return NextResponse.json({
      success: true,
      message: 'Gym owner application rejected successfully',
      data: updatedOwner
    });
  } catch (error: any) {
    console.error('❌ Error rejecting gym owner:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to reject gym owner application',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 