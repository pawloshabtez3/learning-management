import { useAuthStore } from '@/store/authStore';

// Hook for auth-related functionality
// Will be fully implemented in task 8.1
export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isStudent: user?.role === 'STUDENT',
    isInstructor: user?.role === 'INSTRUCTOR',
  };
}
