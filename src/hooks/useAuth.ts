'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error,
    login, 
    logout, 
    register,
    refreshToken,
    setError,
  } = useAuthStore();

  const redirectToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const redirectToDashboard = useCallback(() => {
    if (user?.role === 'INSTRUCTOR') {
      router.push('/instructor/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  }, [router, user?.role]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    refreshToken,
    setError,
    redirectToLogin,
    redirectToDashboard,
    isStudent: user?.role === 'STUDENT',
    isInstructor: user?.role === 'INSTRUCTOR',
  };
}
