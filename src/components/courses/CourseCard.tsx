'use client';

import Link from 'next/link';
import type { Course } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useCheckEnrollment, useEnroll } from '@/hooks/useEnrollment';
import { useToast } from '@/hooks/use-toast';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { toast } = useToast();
  const isStudent = user?.role === 'STUDENT';
  const lessonCount = course.lessons?.length ?? 0;

  const { data: isEnrolled, isLoading: checkingEnrollment } = useCheckEnrollment(
    course.id,
    isAuthenticated && isStudent
  );

  const enrollMutation = useEnroll();

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await enrollMutation.mutateAsync(course.id);
      toast({
        title: 'Enrolled successfully!',
        description: `You are now enrolled in ${course.title}`,
      });
    } catch {
      toast({
        title: 'Enrollment failed',
        description: 'Could not enroll in this course. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {course.thumbnail ? (
        <div className="aspect-video bg-muted rounded-t-xl overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-xl flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {course.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>👤 {course.instructor?.name ?? 'Unknown Instructor'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span>📖 {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/courses/${course.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Course
          </Button>
        </Link>
        {isAuthenticated && isStudent && !checkingEnrollment && (
          isEnrolled ? (
            <Link href={`/courses/${course.id}`} className="flex-1">
              <Button className="w-full">Continue</Button>
            </Link>
          ) : (
            <Button
              className="flex-1"
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
