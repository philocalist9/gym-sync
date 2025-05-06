import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  console.log("📡 API HIT: /api/super-admin/approvals");
  try {
    console.log("⏳ Connecting to MongoDB...");
    const client = await clientPromise;
    console.log("✅ Connected to MongoDB successfully");
    
    const db = client.db("gymsync");
    console.log("📊 Using database:", db.databaseName);
    
    const collection = db.collection("gymOwners");
    console.log("📋 Using collection:", collection.collectionName);

    console.log("🔍 Searching for pending gym owners...");
    // Try both status: 'pending' and approved: false to see which one works
    const pendingApprovals = await collection.find({
      $or: [
        { status: 'pending' },
        { approved: false }
      ]
    }).toArray();

    console.log("✅ Found pending approvals:", pendingApprovals.length);
    console.log("📄 Sample data (first item):", pendingApprovals[0] || "No items found");

    return NextResponse.json({
      success: true, 
      count: pendingApprovals.length,
      data: pendingApprovals
    });
  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    console.error("Full error:", error);
    
    // Return more detailed error for debugging
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 