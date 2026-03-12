import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const startTime = Date.now();

  // CSRF Protection: Basic Host header check
  const host = request.headers.get('host');
  const origin = request.headers.get('origin');
  if (request.method !== 'GET' && origin && !origin.includes(host || '')) {
    return new NextResponse('Invalid Origin', { status: 403 });
  }

  const response = NextResponse.next();

  // Performance header
  const duration = Date.now() - startTime;
  response.headers.set('X-Response-Time', `${duration}ms`);

  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com https://www.gstatic.com;
    img-src 'self' blob: data: https://images.unsplash.com https://api.postcodes.io https://www.google.com https://www.gstatic.com https://translate.google.com https://fonts.gstatic.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.postcodes.io https://translate.googleapis.com https://translate-pa.googleapis.com https://unpkg.com;
    frame-src 'self' https://www.youtube.com https://calendly.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Strict Transport Security (Only for HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
