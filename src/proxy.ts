import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is admin-only
  if (pathname.startsWith('/admin')) {
    // Get user data from localStorage (this won't work in middleware, but we'll use it for demonstration)
    // In a real app, you'd use JWT tokens or session cookies
    const token = request.cookies.get('auth_token')?.value;
    
    // For demo purposes, we'll allow access but the page itself will check the role
    // In production, you'd verify the JWT token here and redirect if not admin
    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/account', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
