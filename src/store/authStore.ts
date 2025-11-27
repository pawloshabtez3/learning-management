import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { authApi, setAccessToken, clearTokens, getAccessToken } from '@/services/api';
import { setAuthCookie, clearAuthCookie } from '@/lib/cookies';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Auth operations
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAccessToken: (token) => {
        setAccessToken(token);
        set({ accessToken: token });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(email, password);
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          // Sync auth state to cookie for middleware
          setAuthCookie({
            isAuthenticated: true,
            user: response.user ? { role: response.user.role } : null,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },


      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register(data);
          set({ isLoading: false, error: null });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } finally {
          clearTokens();
          clearAuthCookie();
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshToken: async () => {
        try {
          const response = await authApi.refresh();
          set({
            user: response.user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          // Sync auth state to cookie for middleware
          setAuthCookie({
            isAuthenticated: true,
            user: response.user ? { role: response.user.role } : null,
          });
        } catch {
          clearTokens();
          clearAuthCookie();
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      initialize: () => {
        const token = getAccessToken();
        const state = get();
        if (token && state.user) {
          set({ isAuthenticated: true, isLoading: false, accessToken: token });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync token with API service after rehydration
        if (state?.accessToken) {
          setAccessToken(state.accessToken);
        }
        // Sync auth state to cookie for middleware
        if (state?.isAuthenticated && state?.user) {
          setAuthCookie({
            isAuthenticated: true,
            user: { role: state.user.role },
          });
        }
        state?.initialize();
      },
    }
  )
);
