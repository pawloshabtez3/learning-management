'use client';

import Link from 'next/link';
import type { Course, Lesson } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { useCheckEnrollment, useEnroll } from '@/hooks/useEnrollment';
import { useCourseProgress, type CourseProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';

interface CourseDetailsProps {
  course: Course;
}

export function CourseDetails({ course }: CourseDetailsProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { toast } = useToast();
  const isStudent = user?.role === 'STUDENT';

  const { data: isEnrolled, isLoading: checkingEnrollment } = useCheckEnrollment(
    course.id,
    isAuthenticated && isStudent
  );

  const { data: progress, isLoading: loadingProgress } = useCourseProgress(
    course.id,
    isAuthenticated && isStudent && isEnrolled === true
  );

  const enrollMutation = useEnroll();

  const handleEnroll = async () => {
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

  const lessons = course.lessons ?? [];
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-lg text-muted-foreground">{course.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>👤 {course.instructor?.name ?? 'Unknown Instructor'}</span>
          <span>📖 {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}</span>
        </div>
      </div>

      {/* Enrollment / Progress Section */}
      {isAuthenticated && isStudent && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEnrolled ? 'Your Progress' : 'Enroll in this Course'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checkingEnrollment ? (
              <div className="h-10 bg-muted rounded animate-pulse" />
            ) : isEnrolled ? (
              <ProgressDisplay progress={progress} isLoading={loadingProgress} />
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Enroll now to start learning and track your progress.
                </p>
                <Button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Sign in to enroll in this course and track your progress.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lessons List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
        {sortedLessons.length === 0 ? (
          <p className="text-muted-foreground">No lessons available yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedLessons.map((lesson, index) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                index={index}
                isEnrolled={isEnrolled ?? false}
                progress={progress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressDisplay({
  progress,
  isLoading,
}: {
  progress?: CourseProgress;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div className="h-10 bg-muted rounded animate-pulse" />;
  }

  if (!progress) {
    return <p className="text-muted-foreground">Start watching lessons to track your progress.</p>;
  }

  const percentage = progress.percentage ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span>{progress.completedLessons} of {progress.totalLessons} lessons completed</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage === 100 && (
        <p className="text-sm text-green-600 font-medium">🎉 Course completed!</p>
      )}
    </div>
  );
}

function LessonItem({
  lesson,
  index,
  isEnrolled,
  progress,
}: {
  lesson: Lesson;
  index: number;
  isEnrolled: boolean;
  progress?: CourseProgress;
}) {
  const lessonProgress = progress?.lessons?.find((l) => l.id === lesson.id);
  const isCompleted = lessonProgress?.completed ?? false;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
        {isCompleted ? '✓' : index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{lesson.title}</h3>
        {lesson.quiz && (
          <span className="text-xs text-muted-foreground">Includes quiz</span>
        )}
      </div>
      {isEnrolled && (
        <Link href={`/lessons/${lesson.id}`}>
          <Button variant="outline" size="sm">
            {isCompleted ? 'Review' : 'Start'}
          </Button>
        </Link>
      )}
    </div>
  );
}
