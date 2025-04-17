import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const directRole = req.cookies.get("role")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    let role = directRole;

    // If no direct role cookie, try to extract from JWT token
    if (!role && token.includes('.')) {
      // This looks like a JWT token, parse it
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      role = payload.role;
    } 
    // Handle mock tokens (format: mock-token-rolename)
    else if (!role && token.startsWith('mock-token-')) {
      role = token.substring('mock-token-'.length);
    }

    if (!role) {
      // If still no role, redirect to login
      console.error("No role found in token or cookies");
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      response.cookies.delete("role");
      return response;
    }

    const path = req.nextUrl.pathname;

    // Define allowed paths for each role
    const allowedPaths: Record<string, string[]> = {
      "member": ["/dashboard/member", "/member/dashboard"],
      "trainer": ["/dashboard/trainer", "/trainer/dashboard"],
      "gymOwner": ["/dashboard/gym-owner", "/gym-owner/dashboard"],
      "superAdmin": ["/dashboard/super-admin", "/admin/dashboard"]
    };

    // Check if user is accessing an allowed path
    if (!allowedPaths[role]?.some((p) => path.startsWith(p))) {
      // Get the first allowed path for this role
      const redirectPath = allowedPaths[role]?.[0] || "/";
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token parsing fails, clear the cookie and redirect to login
    console.error("Token parsing error:", error);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    response.cookies.delete("role");
    return response;
  }
}

export const config = {
  matcher: [
    "/member/:path*", 
    "/trainer/:path*", 
    "/gym-owner/:path*", 
    "/admin/:path*",
    "/dashboard/:path*"
  ]
}; 