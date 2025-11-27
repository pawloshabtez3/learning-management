import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';
import { generateTemplateSummary } from './templates/summary.template';
import { generateTemplateQuiz, GeneratedQuestion } from './templates/quiz.template';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private gpt4allAvailable = false;

  constructor(
    private prisma: PrismaService,
    private lessonsService: LessonsService,
  ) {
    this.initializeGpt4All();
  }

  /**
   * Initialize GPT4All model (if available)
   * Falls back to template-based generation if unavailable
   */
  private async initializeGpt4All(): Promise<void> {
    try {
      // GPT4All integration would go here
      // For MVP, we use template-based fallback
      this.logger.log('GPT4All not configured, using template-based fallback');
      this.gpt4allAvailable = false;
    } catch (error) {
      this.logger.warn('GPT4All initialization failed, using template fallback', error);
      this.gpt4allAvailable = false;
    }
  }

  /**
   * Check if AI service is available
   */
  isAiAvailable(): boolean {
    return this.gpt4allAvailable;
  }

  /**
   * Generate a summary for a lesson
   * Uses cached summary if available, otherwise generates new one
   */
  async generateSummary(lessonId: string): Promise<{ summary: string; cached: boolean; aiGenerated: boolean }> {
    // Check if lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        summaryCache: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Return cached summary if available
    if (lesson.summaryCache) {
      return {
        summary: lesson.summaryCache.summary,
        cached: true,
        aiGenerated: false,
      };
    }

    // Generate new summary
    let summary: string;
    let aiGenerated = false;

    if (this.gpt4allAvailable) {
      try {
        summary = await this.generateAiSummary(lesson.content);
        aiGenerated = true;
      } catch (error) {
        this.logger.warn('AI summary generation failed, using template', error);
        summary = generateTemplateSummary(lesson.content);
      }
    } else {
      summary = generateTemplateSummary(lesson.content);
    }

    // Cache the summary
    await this.prisma.summaryCache.create({
      data: {
        lessonId,
        summary,
      },
    });

    return {
      summary,
      cached: false,
      aiGenerated,
    };
  }

  /**
   * Generate quiz questions for a lesson
   * Uses AI if available, otherwise falls back to templates
   */
  async generateQuizQuestions(lessonId: string): Promise<{
    questions: GeneratedQuestion[];
    aiGenerated: boolean;
  }> {
    // Get lesson with course info for authorization check
    const lesson = await this.lessonsService.findOne(lessonId);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    let questions: GeneratedQuestion[];
    let aiGenerated = false;

    if (this.gpt4allAvailable) {
      try {
        questions = await this.generateAiQuiz(lesson.content, lesson.title);
        aiGenerated = true;
      } catch (error) {
        this.logger.warn('AI quiz generation failed, using template', error);
        questions = generateTemplateQuiz(lesson.content, lesson.title);
      }
    } else {
      questions = generateTemplateQuiz(lesson.content, lesson.title);
    }

    return {
      questions,
      aiGenerated,
    };
  }

  /**
   * Clear cached summary for a lesson
   * Useful when lesson content is updated
   */
  async clearSummaryCache(lessonId: string): Promise<void> {
    await this.prisma.summaryCache.deleteMany({
      where: { lessonId },
    });
  }

  /**
   * Generate summary using GPT4All
   * @private
   */
  private async generateAiSummary(content: string): Promise<string> {
    // GPT4All integration would go here
    // For now, throw to trigger fallback
    throw new Error('GPT4All not implemented');
  }

  /**
   * Generate quiz using GPT4All
   * @private
   */
  private async generateAiQuiz(_content: string, _title: string): Promise<GeneratedQuestion[]> {
    // GPT4All integration would go here
    // For now, throw to trigger fallback
    throw new Error('GPT4All not implemented');
  }
}
