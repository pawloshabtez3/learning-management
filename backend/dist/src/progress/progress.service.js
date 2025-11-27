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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateProgress(updateProgressDto, userId) {
        const { lessonId, completed } = updateProgressDto;
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { course: true },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: lesson.courseId,
                },
            },
        });
        if (!enrollment) {
            throw new common_1.ForbiddenException('You must be enrolled in this course to track progress');
        }
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
    async getCourseProgress(courseId, userId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: {
                    select: { id: true },
                },
            },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        if (!enrollment) {
            throw new common_1.ForbiddenException('You must be enrolled in this course to view progress');
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
    async getLessonProgress(lessonId, userId) {
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
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map