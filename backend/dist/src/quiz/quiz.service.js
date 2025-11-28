"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuizService = class QuizService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByLesson(lessonId) {
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
            throw new common_1.NotFoundException('Quiz not found for this lesson');
        }
        return {
            ...quiz,
            questions: quiz.questions.map((q) => ({
                ...q,
                options: JSON.parse(q.options),
            })),
        };
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('Quiz not found');
        }
        return quiz;
    }
    async create(createQuizDto, userId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: createQuizDto.lessonId },
            include: {
                course: true,
                quiz: true,
            },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (lesson.course.instructorId !== userId) {
            throw new common_1.ForbiddenException('You can only create quizzes for your own courses');
        }
        if (lesson.quiz) {
            throw new common_1.ConflictException('A quiz already exists for this lesson');
        }
        for (const q of createQuizDto.questions) {
            if (q.correctIndex >= q.options.length) {
                throw new common_1.BadRequestException(`Correct index ${q.correctIndex} is out of bounds for question "${q.question}"`);
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
    async submit(submitQuizDto, userId) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: submitQuizDto.quizId },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found');
        }
        const existingResult = await this.prisma.quizResult.findUnique({
            where: {
                userId_quizId: {
                    userId,
                    quizId: submitQuizDto.quizId,
                },
            },
        });
        if (existingResult) {
            throw new common_1.ConflictException('You have already submitted this quiz');
        }
        if (submitQuizDto.answers.length !== quiz.questions.length) {
            throw new common_1.BadRequestException(`Expected ${quiz.questions.length} answers, received ${submitQuizDto.answers.length}`);
        }
        let score = 0;
        for (let i = 0; i < quiz.questions.length; i++) {
            if (submitQuizDto.answers[i] === quiz.questions[i].correctIndex) {
                score++;
            }
        }
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
    async getResult(quizId, userId) {
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
            throw new common_1.NotFoundException('Quiz result not found');
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
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map