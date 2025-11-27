'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CourseList } from '@/components/courses/CourseList';
import { Input } from '@/components/ui/input';
import { useCourses } from '@/hooks/useCourses';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: courses = [], isLoading, error } = useCourses();

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) {
      return courses;
    }
    const term = searchTerm.toLowerCase();
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.instructor?.name?.toLowerCase().includes(term)
    );
  }, [courses, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
          <p className="text-muted-foreground">
            Discover courses to expand your knowledge
          </p>
        </div>

        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search courses by title, description, or instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-destructive">Failed to load courses. Please try again later.</p>
          </div>
        ) : (
          <>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mb-4">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            )}
            <CourseList courses={filteredCourses} isLoading={isLoading} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
