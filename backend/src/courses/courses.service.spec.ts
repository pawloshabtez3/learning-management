import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CoursesService', () => {
  let service: CoursesService;

  const mockPrismaService = {
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockInstructor = {
    id: 'instructor-id',
    name: 'Test Instructor',
    email: 'instructor@example.com',
  };

  const mockCourse = {
    id: 'course-id',
    title: 'Test Course',
    description: 'Test Description',
    thumbnail: null,
    published: true,
    instructorId: 'instructor-id',
    createdAt: new Date(),
    updatedAt: new Date(),
    instructor: mockInstructor,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all published courses', async () => {
      const courses = [mockCourse];
      mockPrismaService.course.findMany.mockResolvedValue(courses);

      const result = await service.findAll();

      expect(result).toEqual(courses);
      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        where: { published: true },
        include: {
          instructor: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });


  describe('findOne', () => {
    it('should return a course with lessons', async () => {
      const courseWithLessons = {
        ...mockCourse,
        lessons: [{ id: 'lesson-1', title: 'Lesson 1', order: 1 }],
      };
      mockPrismaService.course.findUnique.mockResolvedValue(courseWithLessons);

      const result = await service.findOne('course-id');

      expect(result).toEqual(courseWithLessons);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a course for instructor', async () => {
      const createDto = { title: 'New Course', description: 'Description' };
      mockPrismaService.course.create.mockResolvedValue({
        ...mockCourse,
        ...createDto,
      });

      const result = await service.create(createDto, 'instructor-id');

      expect(result.title).toBe(createDto.title);
      expect(mockPrismaService.course.create).toHaveBeenCalledWith({
        data: { ...createDto, instructorId: 'instructor-id' },
        include: {
          instructor: { select: { id: true, name: true, email: true } },
        },
      });
    });
  });

  describe('update', () => {
    it('should update course if user is owner', async () => {
      const updateDto = { title: 'Updated Title' };
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.course.update.mockResolvedValue({
        ...mockCourse,
        ...updateDto,
      });

      const result = await service.update('course-id', updateDto, 'instructor-id');

      expect(result.title).toBe(updateDto.title);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);

      await expect(
        service.update('course-id', { title: 'New' }, 'other-user-id'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { title: 'New' }, 'instructor-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete course if user is owner', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);
      mockPrismaService.course.delete.mockResolvedValue(mockCourse);

      const result = await service.remove('course-id', 'instructor-id');

      expect(result.message).toBe('Course deleted successfully');
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      mockPrismaService.course.findUnique.mockResolvedValue(mockCourse);

      await expect(
        service.remove('course-id', 'other-user-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
