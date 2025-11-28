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


function RecentActivity({ enrollments }: { enrollments: Enrollment[] }) {
  // Sort enrollments by date (most recent first)
  const recentEnrollments = [...enrollments]
    .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, 5);

  if (recentEnrollments.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg">📖</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  Enrolled in {enrollment.course?.title ?? 'a course'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {enrollment.course && (
                <Link href={`/courses/${enrollment.course.id}`}>
                  <Button variant="ghost" size="sm">View</Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ContinueLearning({ enrollments }: { enrollments: Enrollment[] }) {
  // Filter to courses that have progress but aren't complete
  const inProgressCourses = enrollments.filter(e => e.course);

  if (inProgressCourses.length === 0) {
    return null;
  }

  const firstCourse = inProgressCourses[0]?.course;
  const firstLesson = firstCourse?.lessons?.[0];

  if (!firstCourse || !firstLesson) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Continue where you left off</p>
            <h3 className="text-lg font-semibold">{firstCourse.title}</h3>
            <p className="text-sm text-muted-foreground">{firstLesson.title}</p>
          </div>
          <Link href={`/lessons/${firstLesson.id}`}>
            <Button>Continue Learning →</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const { data: enrollments, isLoading, error } = useEnrollments();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load dashboard</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const enrollmentList = enrollments ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <Link href="/courses">
            <Button variant="outline">Browse Courses</Button>
          </Link>
        </div>

        {enrollmentList.length > 0 && <StudentStats enrollments={enrollmentList} />}

        {enrollmentList.length > 0 && (
          <div className="mb-8">
            <ContinueLearning enrollments={enrollmentList} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            {enrollmentList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollmentList.map((enrollment) => (
                  <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-4">📚</div>
                <p className="text-muted-foreground mb-4">
                  You haven't enrolled in any courses yet.
                </p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <RecentActivity enrollments={enrollmentList} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/courses" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    📚 Browse All Courses
                  </Button>
                </Link>
                <Link href="/student/dashboard" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    📊 My Progress
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
