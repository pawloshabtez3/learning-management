import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';
import { generateTemplateSummary, extractKeyTerms } from './templates/summary.template';
import { generateTemplateQuiz, parseAiQuizResponse } from './templates/quiz.template';

describe('AiService', () => {
  let service: AiService;

  const mockPrismaService = {
    lesson: {
      findUnique: jest.fn(),
    },
    summaryCache: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockLessonsService = {
    findOne: jest.fn(),
  };

  const mockLesson = {
    id: 'lesson-id',
    title: 'Introduction to JavaScript',
    content: 'JavaScript is a programming language used for web development. It allows developers to create interactive websites. Variables store data values. Functions are reusable blocks of code. Objects contain properties and methods.',
    videoUrl: '/videos/test.mp4',
    order: 1,
    courseId: 'course-id',
    summaryCache: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: LessonsService, useValue: mockLessonsService },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    jest.clearAllMocks();
  });

  describe('isAiAvailable', () => {
    it('should return false when GPT4All is not configured', () => {
      expect(service.isAiAvailable()).toBe(false);
    });
  });

  describe('generateSummary', () => {
    it('should return cached summary if available', async () => {
      const cachedSummary = 'This is a cached summary';
      mockPrismaService.lesson.findUnique.mockResolvedValue({
        ...mockLesson,
        summaryCache: { summary: cachedSummary },
      });

      const result = await service.generateSummary('lesson-id');

      expect(result.summary).toBe(cachedSummary);
      expect(result.cached).toBe(true);
      expect(result.aiGenerated).toBe(false);
    });

    it('should generate and cache new summary when not cached', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);
      mockPrismaService.summaryCache.create.mockResolvedValue({
        id: 'cache-id',
        lessonId: 'lesson-id',
        summary: 'Generated summary',
      });

      const result = await service.generateSummary('lesson-id');

      expect(result.cached).toBe(false);
      expect(result.aiGenerated).toBe(false);
      expect(result.summary).toContain('Key Points');
      expect(mockPrismaService.summaryCache.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockPrismaService.lesson.findUnique.mockResolvedValue(null);

      await expect(service.generateSummary('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('generateQuizQuestions', () => {
    it('should generate quiz questions using template fallback', async () => {
      mockLessonsService.findOne.mockResolvedValue(mockLesson);

      const result = await service.generateQuizQuestions('lesson-id');

      expect(result.questions).toHaveLength(5);
      expect(result.aiGenerated).toBe(false);
      result.questions.forEach((q) => {
        expect(q.question).toBeDefined();
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBeDefined();
      });
    });

    it('should throw NotFoundException if lesson not found', async () => {
      mockLessonsService.findOne.mockRejectedValue(new NotFoundException('Lesson not found'));

      await expect(service.generateQuizQuestions('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('clearSummaryCache', () => {
    it('should delete cached summary for a lesson', async () => {
      mockPrismaService.summaryCache.deleteMany.mockResolvedValue({ count: 1 });

      await service.clearSummaryCache('lesson-id');

      expect(mockPrismaService.summaryCache.deleteMany).toHaveBeenCalledWith({
        where: { lessonId: 'lesson-id' },
      });
    });
  });
});

describe('Template Functions', () => {
  describe('generateTemplateSummary', () => {
    it('should generate summary from content', () => {
      const content = 'JavaScript is a programming language. It is used for web development. Variables store data. Functions are reusable code blocks. Objects have properties.';
      
      const summary = generateTemplateSummary(content);

      expect(summary).toContain('Key Points');
      expect(summary).toContain('•');
    });

    it('should handle empty content', () => {
      const summary = generateTemplateSummary('');

      expect(summary).toBe('No content available to summarize.');
    });

    it('should handle short content', () => {
      const summary = generateTemplateSummary('Short text');

      expect(summary).toContain('Summary:');
    });
  });

  describe('extractKeyTerms', () => {
    it('should extract key terms from content', () => {
      const content = 'JavaScript programming language development variables functions objects methods properties';
      
      const terms = extractKeyTerms(content);

      expect(terms.length).toBeGreaterThan(0);
      expect(terms).toContain('javascript');
    });

    it('should filter out stop words', () => {
      const content = 'the a an is are was were be been being have has had';
      
      const terms = extractKeyTerms(content);

      expect(terms.length).toBe(0);
    });
  });

  describe('generateTemplateQuiz', () => {
    it('should generate 5 quiz questions', () => {
      const content = 'JavaScript programming language development variables functions objects methods properties code blocks';
      
      const questions = generateTemplateQuiz(content, 'Test Lesson');

      expect(questions).toHaveLength(5);
      questions.forEach((q) => {
        expect(q.question).toBeDefined();
        expect(q.options).toHaveLength(4);
        expect(q.correctIndex).toBe(0);
      });
    });

    it('should handle minimal content', () => {
      const questions = generateTemplateQuiz('short', 'Test Lesson');

      expect(questions.length).toBeGreaterThan(0);
      expect(questions.length).toBeLessThanOrEqual(5);
    });
  });

  describe('parseAiQuizResponse', () => {
    it('should parse JSON quiz response', () => {
      const jsonResponse = JSON.stringify([
        { question: 'Q1?', options: ['A', 'B', 'C', 'D'], correctIndex: 0 },
        { question: 'Q2?', options: ['A', 'B', 'C', 'D'], correctIndex: 1 },
      ]);

      const questions = parseAiQuizResponse(jsonResponse);

      expect(questions).toHaveLength(2);
      expect(questions[0].question).toBe('Q1?');
      expect(questions[1].correctIndex).toBe(1);
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidResponse = 'This is not valid JSON';

      const questions = parseAiQuizResponse(invalidResponse);

      expect(Array.isArray(questions)).toBe(true);
    });
  });
});
