'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface AuthProviderProps {
  children: ReactNode;
}

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/courses'];

// Routes that require specific roles
const instructorRoutes = ['/instructor'];
const studentRoutes = ['/student'];

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith('/courses/')
    );
    const isAuthRoute = pathname === '/login' || pathname === '/register';
    const isInstructorRoute = instructorRoutes.some((route) => pathname.startsWith(route));
    const isStudentRoute = studentRoutes.some((route) => pathname.startsWith(route));

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthRoute) {
      if (user?.role === 'INSTRUCTOR') {
        router.replace('/instructor/dashboard');
      } else {
        router.replace('/student/dashboard');
      }
      return;
    }

    // Redirect unauthenticated users to login for protected routes
    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
      return;
    }


    // Role-based route protection
    if (isAuthenticated && user) {
      // Prevent students from accessing instructor routes
      if (isInstructorRoute && user.role !== 'INSTRUCTOR') {
        router.replace('/student/dashboard');
        return;
      }
      // Prevent instructors from accessing student-only routes
      if (isStudentRoute && user.role !== 'STUDENT') {
        router.replace('/instructor/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
