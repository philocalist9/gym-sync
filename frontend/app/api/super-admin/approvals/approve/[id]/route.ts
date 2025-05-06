import { NextRequest, NextResponse } from 'next/server';
import { updateGymOwnerStatus, getGymOwnerById } from '@/lib/models/gymOwners';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("📡 API HIT: /api/super-admin/approvals/approve/[id]");
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing account ID' },
        { status: 400 }
      );
    }
    
    console.log("🔍 Approving gym owner with ID:", id);
    
    // Check if the gym owner exists
    const owner = await getGymOwnerById(id);
    if (!owner) {
      console.error("❌ Gym owner not found with ID:", id);
      return NextResponse.json(
        { error: 'Gym owner not found' },
        { status: 404 }
      );
    }
    
    // Update the status to approved
    console.log("✅ Gym owner found, updating status to approved...");
    const updatedOwner = await updateGymOwnerStatus(id, 'approved');
    
    return NextResponse.json({
      success: true,
      message: 'Gym owner approved successfully',
      data: updatedOwner
    });
  } catch (error: any) {
    console.error('❌ Error approving gym owner:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to approve gym owner application',
        message: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 