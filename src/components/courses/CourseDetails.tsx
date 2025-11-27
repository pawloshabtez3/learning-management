import type { Course } from '@/types';

interface CourseDetailsProps {
  course: Course;
}

// Placeholder - will be fully implemented in task 9.3
export function CourseDetails({ course }: CourseDetailsProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-muted-foreground">{course.description}</p>
    </div>
  );
}
