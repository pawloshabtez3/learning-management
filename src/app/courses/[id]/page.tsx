'use client';

import { use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CourseDetails } from '@/components/courses/CourseDetails';
import { Button } from '@/components/ui/button';
import { useCourse } from '@/hooks/useCourses';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params);
  const { data: course, isLoading, error } = useCourse(id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/courses" className="text-sm text-muted-foreground hover:underline">
            ← Back to Courses
          </Link>
        </div>

        {isLoading && <CourseDetailSkeleton />}

        {error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-destructive mb-4">Failed to load course details.</p>
            <Link href="/courses">
              <Button variant="outline">Back to Courses</Button>
            </Link>
          </div>
        )}

        {course && <CourseDetails course={course} />}
      </main>

      <Footer />
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded w-2/3" />
        <div className="h-5 bg-muted rounded w-full" />
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-10 bg-muted rounded w-32" />
      </div>

      <div className="space-y-4">
        <div className="h-7 bg-muted rounded w-1/4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}
