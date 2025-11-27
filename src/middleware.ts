import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/courses'];

// Routes that require authentication
const protectedRoutes = ['/student', '/instructor', '/lessons', '/quiz'];

// Routes that require specific roles
const instructorRoutes = ['/instructor'];
const studentRoutes = ['/student'];

function isPublicRoute(pathname: string): boolean {
  // Exact match for public routes
  if (publicRoutes.includes(pathname)) return true;
  
  // Allow /courses/* for course detail pages
  if (pathname.startsWith('/courses/')) return true;
  
  return false;
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}

function isInstructorRoute(pathname: string): boolean {
  return instructorRoutes.some((route) => pathname.startsWith(route));
}

function isStudentRoute(pathname: string): boolean {
  return studentRoutes.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth data from localStorage via cookie or header
  // Note: We check for the auth-storage cookie which is set by zustand persist
  const authStorage = request.cookies.get('auth-storage')?.value;
  
  let isAuthenticated = false;
  let userRole: string | null = null;
  
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      isAuthenticated = parsed.state?.isAuthenticated || false;
      userRole = parsed.state?.user?.role || null;
    } catch {
      // Invalid cookie, treat as unauthenticated
    }
  }
  
  // Also check for accessToken in localStorage (via custom header from client)
  // For server-side middleware, we rely on the persisted state
  const accessToken = request.cookies.get('accessToken')?.value;
  if (accessToken && !isAuthenticated) {
    isAuthenticated = true;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute(pathname)) {
    const redirectUrl = userRole === 'INSTRUCTOR' 
      ? '/instructor/dashboard' 
      : '/student/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route protection
  if (isAuthenticated && userRole) {
    // Prevent students from accessing instructor routes
    if (isInstructorRoute(pathname) && userRole !== 'INSTRUCTOR') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    
    // Prevent instructors from accessing student-only routes
    if (isStudentRoute(pathname) && userRole !== 'STUDENT') {
      return NextResponse.redirect(new URL('/instructor/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
