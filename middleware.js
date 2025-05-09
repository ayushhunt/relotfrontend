import { NextResponse } from 'next/server';

// Define protected route "prefixes" (dynamic groups)
const PROTECTED_PREFIXES = [
  '/userprofile',
  '/dashboard',
  '/settings',
  '/my-account',
  '/orders',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the current path starts with any protected prefix
  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (!isProtectedRoute) {
    // If route is not protected, allow access freely
    return NextResponse.next();
  }

  // Check for accessToken or refreshToken in cookies
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  if (accessToken || refreshToken) {
    // Token exists, allow user to continue
    return NextResponse.next();
  }

  // No tokens found -> Redirect to login
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', pathname); // So after login, user comes back to intended page
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Only run middleware on needed routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};
