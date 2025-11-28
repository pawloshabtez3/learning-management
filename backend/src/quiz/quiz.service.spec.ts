import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QuizService', () => {
  let service: QuizService;

  const mockPrismaService = {
    quiz: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    lesson: {
      findUnique: jest.fn(),
    },
    quizResult: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockCourse = {
    id: 'course-id',
    instructorId: 'instructor-id',
  };

  const mockLesson = {
    id: 'lesson-id',
    title: 'Test Lesson',
    course: mockCourse,
    quiz: null,
  };

  const mockQuiz = {
    id: 'quiz-id',
    lessonId: 'lesson-id',
    createdAt: new Date(),
    questions: [
      {
        id: 'q1',
        question: 'What is 2+2?',
        options: JSON.stringify(['3', '4', '5', '6']),
        correctIndex: 1,
        order: 1,
      },
      {
        id: 'q2',
        question: 'What is 3+3?',
        options: JSON.stringify(['5', '6', '7', '8']),
        correctIndex: 1,
        order: 2,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
    jest.clearAllMocks();
  });


  describe('create', () => {
    const createQuizDto = {
      lessonId: 'lesson-id',
      questions: [
        {
          question: 'What is 2+2?',
          options: ['3', '4', '5', '6'],
          correctIndex: 1,
          order: 1,
        },
      ],
    };

    it('should create a quiz for instructor', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrismaService.quiz.create.mockResolvedValue({
        id: 'new-quiz-id',
        lessonId: 'lesson-id',
        questions: [{ id: 'q1', question: 'What is 2+2?', options: '["3","4","5","6"]', order: 1 }],
      });

      const result = await service.create(createQuizDto, 'instructor-id');

      expect(result.id).toBe('new-quiz-id');
      expect(mockPrismaService.quiz.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(service.create(createQuizDto, 'instructor-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not course owner', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);

      await expect(service.create(createQuizDto, 'other-user-id')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ConflictException if quiz already exists', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue({
        ...mockLesson,
        quiz: { id: 'existing-quiz' },
      });

      await expect(service.create(createQuizDto, 'instructor-id')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if correctIndex is out of bounds', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);

      const invalidDto = {
        lessonId: 'lesson-id',
        questions: [
          {
            question: 'Test?',
            options: ['A', 'B'],
            correctIndex: 5,
            order: 1,
          },
        ],
      };

      await expect(service.create(invalidDto, 'instructor-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('submit', () => {
    it('should auto-grade quiz and return score', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizResult.findUnique.mockResolvedValue(null);
      mockPrismaService.quizResult.create.mockResolvedValue({
        id: 'result-id',
        score: 2,
        totalQuestions: 2,
        answers: JSON.stringify([1, 1]),
        submittedAt: new Date(),
      });

      const result = await service.submit(
        { quizId: 'quiz-id', answers: [1, 1] },
        'student-id',
      );

      expect(result.score).toBe(2);
      expect(result.totalQuestions).toBe(2);
      expect(result.percentage).toBe(100);
    });

    it('should throw NotFoundException if quiz not found', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(
        service.submit({ quizId: 'non-existent', answers: [1] }, 'student-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already submitted', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizResult.findUnique.mockResolvedValue({
        id: 'existing-result',
      });

      await expect(
        service.submit({ quizId: 'quiz-id', answers: [1, 1] }, 'student-id'),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if answer count mismatch', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(mockQuiz);
      mockPrismaService.quizResult.findUnique.mockResolvedValue(null);

      await expect(
        service.submit({ quizId: 'quiz-id', answers: [1] }, 'student-id'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByLesson', () => {
    it('should return quiz with parsed options', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue({
        id: 'quiz-id',
        lessonId: 'lesson-id',
        questions: [
          { id: 'q1', question: 'Test?', options: '["A","B","C"]', order: 1 },
        ],
      });

      const result = await service.findByLesson('lesson-id');

      expect(result.questions[0].options).toEqual(['A', 'B', 'C']);
    });

    it('should throw NotFoundException if quiz not found', async () => {
      mockPrismaService.quiz.findUnique.mockResolvedValue(null);

      await expect(service.findByLesson('lesson-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
