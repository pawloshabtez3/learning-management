import type { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseCardProps {
  course: Course;
}

// Placeholder - will be fully implemented in task 9.2
export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{course.description}</p>
      </CardContent>
    </Card>
  );
}
