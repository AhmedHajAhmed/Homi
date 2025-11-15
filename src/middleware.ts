import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  // Since we're using localStorage for auth, we rely on client-side AuthProvider
  // This middleware only handles cookie-based auth if present
  const tokenValue = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // If has cookie token and trying to access auth pages, redirect to dashboard
  if (tokenValue && (pathname === '/login' || pathname === '/signup')) {
    const user = verifyToken(tokenValue);
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // For all other routes, allow through (client-side AuthProvider will handle protection)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

