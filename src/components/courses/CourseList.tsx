'use client';

import type { Course } from '@/types';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  courses: Course[];
  isLoading?: boolean;
}

export function CourseList({ courses, isLoading }: CourseListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📚</div>
        <p className="text-muted-foreground text-lg">No courses available yet.</p>
        <p className="text-muted-foreground text-sm mt-2">
          Check back later for new courses!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card animate-pulse">
      <div className="aspect-video bg-muted rounded-t-xl" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded w-1/2 mt-4" />
      </div>
      <div className="px-6 pb-6">
        <div className="h-9 bg-muted rounded" />
      </div>
    </div>
  );
}
