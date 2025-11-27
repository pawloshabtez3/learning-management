/**
 * Cookie utilities for syncing auth state with middleware
 */

const AUTH_COOKIE_NAME = 'auth-storage';

interface AuthCookieState {
  isAuthenticated: boolean;
  user: {
    role: string;
  } | null;
}

/**
 * Set auth state in cookie for middleware access
 */
export function setAuthCookie(state: AuthCookieState): void {
  if (typeof document === 'undefined') return;
  
  const cookieValue = JSON.stringify({ state });
  const maxAge = 60 * 60 * 24 * 7; // 7 days
  
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(cookieValue)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Clear auth cookie on logout
 */
export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Get auth state from cookie
 */
export function getAuthCookie(): AuthCookieState | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find((c) => c.trim().startsWith(`${AUTH_COOKIE_NAME}=`));
  
  if (!authCookie) return null;
  
  try {
    const value = decodeURIComponent(authCookie.split('=')[1]);
    const parsed = JSON.parse(value);
    return parsed.state || null;
  } catch {
    return null;
  }
}
