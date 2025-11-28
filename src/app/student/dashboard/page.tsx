'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useEnrollments } from '@/hooks/useEnrollment';
import { useCourseProgress, type CourseProgress } from '@/hooks/useProgress';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Enrollment, Course } from '@/types';

function StudentStats({ enrollments }: { enrollments: Enrollment[] }) {
  const totalCourses = enrollments.length;
  const coursesWithProgress = enrollments.filter(e => e.course);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalCourses}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{coursesWithProgress.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
        </CardContent>
      </Card>
    </div>
  );
}

function EnrolledCourseCard({ enrollment }: { enrollment: Enrollment }) {
  const course = enrollment.course;
  const { data: progress, isLoading: loadingProgress } = useCourseProgress(
    course?.id ?? '',
    !!course?.id
  );

  if (!course) return null;

  const percentage = progress?.percentage ?? 0;
  const completedLessons = progress?.completedLessons ?? 0;
  const totalLessons = progress?.totalLessons ?? course.lessons?.length ?? 0;

  // Find the next lesson to continue
  const nextLesson = progress?.lessons?.find(l => !l.completed);
  const firstLesson = course.lessons?.[0];
  const continueLesson = nextLesson || firstLesson;

  return (
    <Card className="flex flex-col h-full">
      {course.thumbnail ? (
        <div className="aspect-video bg-muted rounded-t-xl overflow-hidden">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-xl flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedLessons} of {totalLessons} lessons</span>
            <span>{loadingProgress ? '...' : `${percentage}%`}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {percentage === 100 && (
            <p className="text-xs text-green-600 font-medium">🎉 Completed!</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {continueLesson ? (
          <Link href={`/lessons/${continueLesson.id}`} className="flex-1">
            <Button className="w-full">
              {percentage === 0 ? 'Start Learning' : percentage === 100 ? 'Review' : 'Continue'}
            </Button>
          </Link>
        ) : (
          <Link href={`/courses/${course.id}`} className="flex-1">
            <Button variant="outline" className="w-full">View Course</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
