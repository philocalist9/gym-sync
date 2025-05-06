import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
    const url = `${apiBaseUrl}${endpoint}`;
    
    console.log(`Proxying request to: ${url}`);
    
    // Get authorization from original request
    const authHeader = request.headers.get('authorization');
    
    // Create AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { 'Authorization': authHeader } : {})
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Log success
      console.log(`Proxy success for ${endpoint}, status: ${response.status}`);
      
      return NextResponse.json(data);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error(`Request timeout for ${url}`);
        throw new Error('Backend request timed out after 8 seconds');
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    console.error(`Proxy error for ${endpoint}:`, error);
    
    // Return a user-friendly error
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch from backend',
        proxyError: true,
        statusText: 'Service Unavailable'
      }, 
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
    const url = `${apiBaseUrl}${endpoint}`;
    
    console.log(`Proxying POST request to: ${url}`);
    
    // Get authorization from original request
    const authHeader = request.headers.get('authorization');
    
    // Get body from request
    const body = await request.json();
    
    // Create AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { 'Authorization': authHeader } : {})
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Log success
      console.log(`Proxy POST success for ${endpoint}, status: ${response.status}`);
      
      return NextResponse.json(data);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error(`POST request timeout for ${url}`);
        throw new Error('Backend request timed out after 8 seconds');
      }
      
      throw fetchError;
    }
  } catch (error: any) {
    console.error(`Proxy POST error for ${endpoint}:`, error);
    
    // Return a user-friendly error
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch from backend',
        proxyError: true,
        statusText: 'Service Unavailable'
      }, 
      { status: 503 }
    );
  }
} 