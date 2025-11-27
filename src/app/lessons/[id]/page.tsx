'use client';

import { use, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { Button } from '@/components/ui/button';
import { useLesson } from '@/hooks/useLessons';
import { useAuthStore } from '@/store/authStore';
import { useLessonProgress, useUpdateProgress } from '@/hooks/useProgress';

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { id } = use(params);
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';
  
  const { data: lesson, isLoading, error } = useLesson(id);
  
  // Fetch lesson progress for students
  const { data: lessonProgress } = useLessonProgress(
    id,
    isAuthenticated && isStudent
  );
  
  const isCompleted = lessonProgress?.completed ?? false;

  // Mutation to mark lesson as complete
  const updateProgress = useUpdateProgress();

  const handleComplete = useCallback(() => {
    if (isAuthenticated && isStudent && !isCompleted) {
      updateProgress.mutate({ lessonId: id, completed: true });
    }
  }, [isAuthenticated, isStudent, isCompleted, updateProgress, id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-6 px-4 max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-6">
          {lesson?.courseId ? (
            <Link
              href={`/courses/${lesson.courseId}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              ← Back to Course
            </Link>
          ) : (
            <Link href="/courses" className="text-sm text-muted-foreground hover:underline">
              ← Back to Courses
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading && <LessonSkeleton />}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-destructive mb-4">Failed to load lesson.</p>
            <Link href="/courses">
              <Button variant="outline">Back to Courses</Button>
            </Link>
          </div>
        )}

        {/* Auth Check */}
        {!isAuthenticated && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔒</div>
            <p className="text-muted-foreground mb-4">
              Please sign in to access this lesson.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Lesson Player */}
        {lesson && isAuthenticated && (
          <LessonPlayer
            lesson={lesson}
            isCompleted={isCompleted}
            onComplete={handleComplete}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}


function LessonSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Video Skeleton */}
      <div className="aspect-video bg-muted rounded-lg" />
      
      {/* Progress Bar Skeleton */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-12" />
        </div>
        <div className="h-2 bg-muted rounded-full" />
      </div>

      {/* Info Card Skeleton */}
      <div className="rounded-xl border p-6 space-y-2">
        <div className="h-8 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/4" />
      </div>

      {/* Content Skeleton */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    </div>
  );
}
