import type { Course } from '@/types';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  courses: Course[];
}

// Placeholder - will be fully implemented in task 9.2
export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No courses available.</p>
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
