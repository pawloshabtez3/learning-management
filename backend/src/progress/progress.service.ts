import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async updateProgress(updateProgressDto: UpdateProgressDto, userId: string) {
    const { lessonId, completed } = updateProgressDto;

    // Get lesson with course info
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if user is enrolled in the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in this course to track progress');
    }

    // Upsert progress record
    return this.prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
    });
  }

  async getCourseProgress(courseId: string, userId: string) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          select: { id: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check enrollment
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in this course to view progress');
    }

    const totalLessons = course.lessons.length;

    if (totalLessons === 0) {
      return {
        courseId,
        totalLessons: 0,
        completedLessons: 0,
        completionPercentage: 0,
        lessons: [],
      };
    }

    // Get progress for all lessons in the course
    const lessonIds = course.lessons.map((l) => l.id);
    const progressRecords = await this.prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
        completed: true,
      },
    });

    const completedLessons = progressRecords.length;
    const completionPercentage = Math.round((completedLessons / totalLessons) * 100);

    // Get detailed lesson progress
    const lessonsWithProgress = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        progress: {
          where: { userId },
          select: {
            completed: true,
            completedAt: true,
          },
        },
      },
    });

    const lessons = lessonsWithProgress.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      completed: lesson.progress[0]?.completed ?? false,
      completedAt: lesson.progress[0]?.completedAt ?? null,
    }));

    return {
      courseId,
      totalLessons,
      completedLessons,
      completionPercentage,
      lessons,
    };
  }

  async getLessonProgress(lessonId: string, userId: string) {
    const progress = await this.prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    return {
      lessonId,
      completed: progress?.completed ?? false,
      completedAt: progress?.completedAt ?? null,
    };
  }
}
