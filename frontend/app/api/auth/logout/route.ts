import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  
  // Clear cookies
  cookieStore.delete('token');
  cookieStore.delete('role');
  
  // Redirect to home page
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
} 