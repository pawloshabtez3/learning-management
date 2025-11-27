import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LessonsService', () => {
  let service: LessonsService;

  const mockPrismaService = {
    lesson: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    course: {
      findUnique: jest.fn(),
    },
  };

  const mockCourse = {
    id: 'course-id',
    title: 'Test Course',
    instructorId: 'instructor-id',
  };

  const mockLesson = {
    id: 'lesson-id',
    title: 'Test Lesson',
    content: 'Test content',
    videoUrl: '/videos/test.mp4',
    order: 1,
    courseId: 'course-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    course: mockCourse,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    jest.clearAllMocks();
  });


  describe('findOne', () => {
    it('should return a lesson with course info', async () => {
      const lessonWithCourse = { ...mockLesson, quiz: null };
      mockPrismaService.lesson.findUnique.mockResolvedValue(lessonWithCourse);

      const result = await service.findOne('lesson-id');

      expect(result).toEqual(lessonWithCourse);
      expect(mockPrismaService.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: 'lesson-id' },
        include: {
          course: { select: { id: true, title: true, instructorId: true } },
          quiz: { select: { id: true } },
        },
      });
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCourse', () => {
    it('should return lessons for a course ordered by order', async () => {
      const lessons = [
        { id: 'lesson-1', title: 'Lesson 1', order: 1, videoUrl: '/videos/1.mp4' },
        { id: 'lesson-2', title: 'Lesson 2', order: 2, videoUrl: '/videos/2.mp4' },
      ];
      mockPrismaService.lesson.findMany.mockResolvedValue(lessons);

      const result = await service.findByCourse('course-id');

      expect(result).toEqual(lessons);
      expect(mockPrismaService.lesson.findMany).toHaveBeenCalledWith({
        where: { courseId: 'course-id' },
        orderBy: { order: 'asc' },
        select: { id: true, title: true, order: true, videoUrl: true },
      });
    });
  });

  describe('create', () => {
    it('should create a lesson for instructor', async () => {
      const createDto = {
        title: 'New Lesson',
        content: 'Content',
        videoUrl: '/videos/new.mp4',
        courseId: 'course-id',
      };
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.lesson.findFirst.mockResolvedValue(null);
      mockPrismaService.lesson.create.mockResolvedValue({
        ...mockLesson,
        ...createDto,
      });

      const result = await service.create(createDto, 'instructor-id');

      expect(result.title).toBe(createDto.title);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          { title: 'Test', content: 'Test', videoUrl: '/test.mp4', courseId: 'non-existent' },
          'instructor-id',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not course owner', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);

      await expect(
        service.create(
          { title: 'Test', content: 'Test', videoUrl: '/test.mp4', courseId: 'course-id' },
          'other-user-id',
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update lesson if user is course owner', async () => {
      const updateDto = { title: 'Updated Title' };
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrismaService.lesson.update.mockResolvedValue({
        ...mockLesson,
        ...updateDto,
      });

      const result = await service.update('lesson-id', updateDto, 'instructor-id');

      expect(result.title).toBe(updateDto.title);
    });

    it('should throw ForbiddenException if user is not course owner', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);

      await expect(
        service.update('lesson-id', { title: 'New' }, 'other-user-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete lesson if user is course owner', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrismaService.lesson.delete.mockResolvedValue(mockLesson);

      const result = await service.remove('lesson-id', 'instructor-id');

      expect(result.message).toBe('Lesson deleted successfully');
    });

    it('should throw ForbiddenException if user is not course owner', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);

      await expect(
        service.remove('lesson-id', 'other-user-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
