import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // DEVELOPMENT MODE: Disable all authentication redirects for testing
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // Only apply rate limiting, skip all authentication redirects
    if ((pathname.startsWith('/api/auth/') && pathname !== '/api/auth/session') || pathname === '/register') {
      const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const maxRequests = 100; // 100 requests in development

      const rateLimitData = rateLimitStore.get(clientIP);
      
      if (rateLimitData) {
        if (now > rateLimitData.resetTime) {
          rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs });
        } else if (rateLimitData.count >= maxRequests) {
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { error: 'Too many requests. Please try again later.' },
              { status: 429 }
            );
          }
        } else {
          rateLimitStore.set(clientIP, { 
            count: rateLimitData.count + 1, 
            resetTime: rateLimitData.resetTime 
          });
        }
      } else {
        rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs });
      }
    }
    
    // Skip all authentication logic in development
    // Let NextAuth handle its own cookies and headers
    return NextResponse.next();
  }

  // PRODUCTION MODE: Full authentication logic
  if (!isDevelopment) {
    // Rate limiting for auth endpoints (excluding session endpoint which NextAuth needs and login page)
    // TEMPORARILY DISABLED to allow login after rate limit hit
    /*
    if ((pathname.startsWith('/api/auth/') && pathname !== '/api/auth/session') || pathname === '/login' || pathname === '/register') {
      const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const maxRequests = 5; // Max 5 requests per 15 minutes

      const rateLimitData = rateLimitStore.get(clientIP);
      
      if (rateLimitData) {
        if (now > rateLimitData.resetTime) {
          // Reset window
          rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs });
        } else if (rateLimitData.count >= maxRequests) {
          // Rate limit exceeded - only for API endpoints, not pages
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { error: 'Too many requests. Please try again later.' },
              { status: 429 }
            );
          }
          // For pages, continue normally but don't increment counter
        } else {
          // Increment count
          rateLimitStore.set(clientIP, { 
            count: rateLimitData.count + 1, 
            resetTime: rateLimitData.resetTime 
          });
        }
      } else {
        // First request
        rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs });
      }
    }
    */

    // Protected routes - require authentication (PRODUCTION ONLY)
    const protectedRoutes = ['/profile', '/cart', '/dashboard', '/seller', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
      console.log('[MIDDLEWARE] PROTECTED ROUTE CHECK - pathname:', pathname);
      console.log('[MIDDLEWARE] NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
      
      try {
        const token = await getToken({ 
          req: request, 
          secret: process.env.NEXTAUTH_SECRET,
          cookieName: 'next-auth.session-token'
        });

        console.log('[MIDDLEWARE] Token exists:', !!token);
        if (token) {
          console.log('[MIDDLEWARE] Token role:', token.role);
          console.log('[MIDDLEWARE] Token status:', token.status);
          console.log('[MIDDLEWARE] Token email:', token.email);
        }

        if (!token) {
          console.log('[MIDDLEWARE] No token found - redirecting to login');
          // Redirect to login with callback URL
          const loginUrl = new URL('/login', request.url);
          loginUrl.searchParams.set('callbackUrl', pathname);
          return NextResponse.redirect(loginUrl);
        }

        // Check user status for additional protection
        if (token.status !== 'ACTIVE') {
          console.log('[MIDDLEWARE] User status not ACTIVE - redirecting to verify-otp');
          const verifyUrl = new URL('/verify-otp', request.url);
          return NextResponse.redirect(verifyUrl);
        }

        // Admin-only routes
        if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
          console.log('[MIDDLEWARE] User not ADMIN - redirecting to access-denied');
          return NextResponse.redirect(new URL('/access-denied', request.url));
        }

        // Seller-only routes
        if (pathname.startsWith('/seller') && token.role !== 'SELLER' && token.role !== 'ADMIN') {
          console.log('[MIDDLEWARE] User not SELLER or ADMIN - redirecting to access-denied');
          return NextResponse.redirect(new URL('/access-denied', request.url));
        }

        console.log('[MIDDLEWARE] Access granted for:', pathname);
      } catch (error) {
        // If token validation fails, redirect to login
        console.error('[MIDDLEWARE] Token validation error:', error);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Public routes - redirect authenticated users (PRODUCTION ONLY)
    // TEMPORARILY DISABLED to allow logout and login again for role refresh
    const publicRoutes = ['/login', '/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // Commented out temporarily to allow logout
    /*
    if (isPublicRoute) {
      try {
        const token = await getToken({ 
          req: request, 
          secret: process.env.NEXTAUTH_SECRET 
        });

        if (token) {
          // Redirect authenticated users to dashboard
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } catch (error) {
        // If token validation fails, continue to public route
        console.error('Token validation error on public route:', error);
      }
    }
    */
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS (HTTP Strict Transport Security) - Only in production with HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // CSP Header (Content Security Policy) - Enhanced
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://accounts.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.resend.com https://accounts.google.com https://oauth2.googleapis.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
