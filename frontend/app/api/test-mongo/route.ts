import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("⏳ Testing MongoDB connection...");
    const client = await clientPromise;
    console.log("✅ Connected to MongoDB successfully");
    
    const db = client.db("gymsync");
    console.log("📊 Using database:", db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log("📋 Available collections:", collections.map(c => c.name));
    
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful",
      database: db.databaseName,
      collections: collections.map(c => c.name)
    });
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Full error:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 