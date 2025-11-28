'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useInstructorCourses, type InstructorCourse } from '@/hooks/useInstructor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function CourseStats({ courses }: { courses: InstructorCourse[] }) {
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.published).length;
  const totalEnrollments = courses.reduce((sum, c) => sum + (c._count?.enrollments ?? 0), 0);
  const totalLessons = courses.reduce((sum, c) => sum + (c._count?.lessons ?? 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalCourses}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{publishedCourses}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalEnrollments}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalLessons}</p>
        </CardContent>
      </Card>
    </div>
  );
}


function InstructorCourseCard({ course }: { course: InstructorCourse }) {
  const enrollmentCount = course._count?.enrollments ?? 0;
  const lessonCount = course._count?.lessons ?? 0;

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
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full ${course.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {course.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>👥 {enrollmentCount} {enrollmentCount === 1 ? 'student' : 'students'}</span>
          <span>📖 {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/instructor/courses/${course.id}/edit`} className="flex-1">
          <Button variant="outline" className="w-full">Edit</Button>
        </Link>
        <Link href={`/courses/${course.id}`} className="flex-1">
          <Button variant="ghost" className="w-full">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}


export default function InstructorDashboardPage() {
  const { user } = useAuthStore();
  const { data: courses, isLoading, error } = useInstructorCourses();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Failed to load courses</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Link href="/instructor/courses/create">
          <Button>+ Create Course</Button>
        </Link>
      </div>

      {courses && courses.length > 0 && <CourseStats courses={courses} />}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <InstructorCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any courses yet.</p>
            <Link href="/instructor/courses/create">
              <Button>Create Your First Course</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
