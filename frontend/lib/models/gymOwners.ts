import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface GymOwner {
  _id?: string | ObjectId;
  name: string;
  email: string;
  gymName: string;
  phoneNumber: string;
  address: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const DB_NAME = 'gymsync';
const COLLECTION_NAME = 'gymOwners';

export async function getPendingGymOwners() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const owners = await db
      .collection(COLLECTION_NAME)
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();
    
    return JSON.parse(JSON.stringify(owners));
  } catch (error) {
    console.error('Error fetching pending gym owners:', error);
    throw error;
  }
}

export async function getApprovedGymOwners() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const owners = await db
      .collection(COLLECTION_NAME)
      .find({ status: 'approved' })
      .sort({ updatedAt: -1 })
      .toArray();
    
    return JSON.parse(JSON.stringify(owners));
  } catch (error) {
    console.error('Error fetching approved gym owners:', error);
    throw error;
  }
}

export async function addGymOwner(data: Omit<GymOwner, '_id' | 'createdAt' | 'updatedAt'>) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const now = new Date();
    const newGymOwner = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await db.collection(COLLECTION_NAME).insertOne(newGymOwner);
    
    return {
      ...newGymOwner,
      _id: result.insertedId
    };
  } catch (error) {
    console.error('Error adding gym owner:', error);
    throw error;
  }
}

export async function updateGymOwnerStatus(id: string, status: 'approved' | 'rejected') {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const objectId = new ObjectId(id);
    const now = new Date();
    
    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { _id: objectId },
      { 
        $set: { 
          status,
          updatedAt: now
        } 
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      throw new Error('Gym owner not found');
    }
    
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error(`Error updating gym owner status to ${status}:`, error);
    throw error;
  }
}

export async function getGymOwnerById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const objectId = new ObjectId(id);
    const owner = await db.collection(COLLECTION_NAME).findOne({ _id: objectId });
    
    if (!owner) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(owner));
  } catch (error) {
    console.error('Error fetching gym owner by ID:', error);
    throw error;
  }
}

export async function getGymOwnerByEmail(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const owner = await db.collection(COLLECTION_NAME).findOne({ email });
    
    if (!owner) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(owner));
  } catch (error) {
    console.error('Error fetching gym owner by email:', error);
    throw error;
  }
} 