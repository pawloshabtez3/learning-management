import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;

  const mockPrismaService = {
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const courseId = 'course-123';
    const createEnrollmentDto = { courseId };

    it('should create enrollment successfully', async () => {
      const course = { id: courseId, title: 'Test Course' };
      const enrollment = {
        id: 'enrollment-123',
        userId,
        courseId,
        enrolledAt: new Date(),
        course: { id: courseId, title: 'Test Course', description: 'Desc', thumbnail: null },
      };

      mockPrismaService.course.findUnique.mockResolvedValue(course);
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null);
      mockPrismaService.enrollment.create.mockResolvedValue(enrollment);

      const result = await service.create(createEnrollmentDto, userId);

      expect(result.id).toBe('enrollment-123');
      expect(result.courseId).toBe(courseId);
      expect(mockPrismaService.enrollment.create).toHaveBeenCalledWith({
        data: { userId, courseId },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if course does not exist', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.create(createEnrollmentDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if already enrolled', async () => {
      const course = { id: courseId, title: 'Test Course' };
      const existingEnrollment = { id: 'existing', userId, courseId };

      mockPrismaService.course.findUnique.mockResolvedValue(course);
      mockPrismaService.enrollment.findUnique.mockResolvedValue(existingEnrollment);

      await expect(service.create(createEnrollmentDto, userId)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('isEnrolled', () => {
    it('should return true if user is enrolled', async () => {
      mockPrismaService.enrollment.findUnique.mockResolvedValue({
        id: 'enrollment-123',
      });

      const result = await service.isEnrolled('user-123', 'course-123');

      expect(result).toBe(true);
    });

    it('should return false if user is not enrolled', async () => {
      mockPrismaService.enrollment.findUnique.mockResolvedValue(null);

      const result = await service.isEnrolled('user-123', 'course-123');

      expect(result).toBe(false);
    });
  });
});
