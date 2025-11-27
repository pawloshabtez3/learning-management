'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          LMS
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/courses" className="text-sm hover:underline">
            Courses
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href={
                  user?.role === 'INSTRUCTOR'
                    ? '/instructor/dashboard'
                    : '/student/dashboard'
                }
                className="text-sm hover:underline"
              >
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
