import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto, SubmitQuizDto } from './dto';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async findByLesson(lessonId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found for this lesson');
    }

    // Parse options JSON for each question
    return {
      ...quiz,
      questions: quiz.questions.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      })),
    };
  }

  async findById(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                instructorId: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }


  async create(createQuizDto: CreateQuizDto, userId: string) {
    // Verify the lesson exists and get course info
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: createQuizDto.lessonId },
      include: {
        course: true,
        quiz: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.course.instructorId !== userId) {
      throw new ForbiddenException(
        'You can only create quizzes for your own courses',
      );
    }

    if (lesson.quiz) {
      throw new ConflictException('A quiz already exists for this lesson');
    }

    // Validate correctIndex for each question
    for (const q of createQuizDto.questions) {
      if (q.correctIndex >= q.options.length) {
        throw new BadRequestException(
          `Correct index ${q.correctIndex} is out of bounds for question "${q.question}"`,
        );
      }
    }

    return this.prisma.quiz.create({
      data: {
        lessonId: createQuizDto.lessonId,
        questions: {
          create: createQuizDto.questions.map((q) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            order: q.order,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
          },
        },
      },
    });
  }

  async submit(submitQuizDto: SubmitQuizDto, userId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: submitQuizDto.quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check if user already submitted this quiz
    const existingResult = await this.prisma.quizResult.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: submitQuizDto.quizId,
        },
      },
    });

    if (existingResult) {
      throw new ConflictException('You have already submitted this quiz');
    }

    // Validate answer count
    if (submitQuizDto.answers.length !== quiz.questions.length) {
      throw new BadRequestException(
        `Expected ${quiz.questions.length} answers, received ${submitQuizDto.answers.length}`,
      );
    }

    // Auto-grade the quiz
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (submitQuizDto.answers[i] === quiz.questions[i].correctIndex) {
        score++;
      }
    }

    // Store the result
    const result = await this.prisma.quizResult.create({
      data: {
        userId,
        quizId: submitQuizDto.quizId,
        score,
        totalQuestions: quiz.questions.length,
        answers: JSON.stringify(submitQuizDto.answers),
      },
    });

    return {
      id: result.id,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: Math.round((score / quiz.questions.length) * 100),
      submittedAt: result.submittedAt,
    };
  }

  async getResult(quizId: string, userId: string) {
    const result = await this.prisma.quizResult.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId,
        },
      },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Quiz result not found');
    }

    return {
      id: result.id,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: Math.round((result.score / result.totalQuestions) * 100),
      answers: JSON.parse(result.answers),
      submittedAt: result.submittedAt,
      questions: result.quiz.questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options),
        correctIndex: q.correctIndex,
      })),
    };
  }
}
