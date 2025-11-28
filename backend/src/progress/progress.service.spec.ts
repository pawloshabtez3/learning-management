import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProgressService', () => {
  let service: ProgressService;

  const mockPrismaService = {
    lesson: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
    },
    progress: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProgressService>(ProgressService);
    jest.clearAllMocks();
  });

  describe('updateProgress', () => {
    const userId = 'user-123';
    const lessonId = 'lesson-123';
    const courseId = 'course-123';

    it('should update progress successfully', async () => {
      const lesson = { id: lessonId, courseId, course: { id: courseId } };
      const enrollment = { id: 'enrollment-123', userId, courseId };
      const progress = {
        id: 'progress-123',
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        lesson: { id: lessonId, title: 'Test Lesson', courseId },
      };

      mockPrismaService.lesson.findUnique.mockResolvedValue(lesson);
      mockPrismaService.enrollment.findUnique.mockResolvedValue(enrollment);
      mockPrismaService.progress.upsert.mockResolvedValue(progress);

      const result = await service.updateProgress({ lessonId, completed: true }, userId);

      expect(result.completed).toBe(true);
      expect(mockPrismaService.progress.upsert).toHaveBeenCalled();
    });

    it('should throw NotFoundException if lesson does not exist', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProgress({ lessonId, completed: true }, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not enrolled', async () => {
      const lesson = { id: lessonId, courseId, course: { id: courseId } };

      mockPrismaService.lesson.findUnique.mockResolvedValue(lesson);
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProgress({ lessonId, completed: true }, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getCourseProgress', () => {
    const userId = 'user-123';
    const courseId = 'course-123';

    it('should calculate completion percentage correctly', async () => {
      const course = {
        id: courseId,
        lessons: [{ id: 'lesson-1' }, { id: 'lesson-2' }, { id: 'lesson-3' }, { id: 'lesson-4' }],
      };
      const enrollment = { id: 'enrollment-123', userId, courseId };
      const completedProgress = [
        { id: 'p1', lessonId: 'lesson-1', completed: true },
        { id: 'p2', lessonId: 'lesson-2', completed: true },
      ];
      const lessonsWithProgress = [
        { id: 'lesson-1', title: 'L1', order: 1, progress: [{ completed: true, completedAt: new Date() }] },
        { id: 'lesson-2', title: 'L2', order: 2, progress: [{ completed: true, completedAt: new Date() }] },
        { id: 'lesson-3', title: 'L3', order: 3, progress: [] },
        { id: 'lesson-4', title: 'L4', order: 4, progress: [] },
      ];

      mockPrismaService.course.findUnique.mockResolvedValue(course);
      mockPrismaService.enrollment.findUnique.mockResolvedValue(enrollment);
      mockPrismaService.progress.findMany.mockResolvedValue(completedProgress);
      mockPrismaService.lesson.findMany.mockResolvedValue(lessonsWithProgress);

      const result = await service.getCourseProgress(courseId, userId);

      expect(result.totalLessons).toBe(4);
      expect(result.completedLessons).toBe(2);
      expect(result.completionPercentage).toBe(50);
    });

    it('should return 0% for course with no lessons', async () => {
      const course = { id: courseId, lessons: [] };
      const enrollment = { id: 'enrollment-123', userId, courseId };

      mockPrismaService.course.findUnique.mockResolvedValue(course);
      mockPrismaService.enrollment.findUnique.mockResolvedValue(enrollment);

      const result = await service.getCourseProgress(courseId, userId);

      expect(result.completionPercentage).toBe(0);
      expect(result.totalLessons).toBe(0);
    });

    it('should throw NotFoundException if course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.getCourseProgress(courseId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if not enrolled', async () => {
      const course = { id: courseId, lessons: [] };

      mockPrismaService.course.findUnique.mockResolvedValue(course);
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null);

      await expect(service.getCourseProgress(courseId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
