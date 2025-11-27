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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const lessons_service_1 = require("../lessons/lessons.service");
const summary_template_1 = require("./templates/summary.template");
const quiz_template_1 = require("./templates/quiz.template");
let AiService = AiService_1 = class AiService {
    prisma;
    lessonsService;
    logger = new common_1.Logger(AiService_1.name);
    gpt4allAvailable = false;
    constructor(prisma, lessonsService) {
        this.prisma = prisma;
        this.lessonsService = lessonsService;
        this.initializeGpt4All();
    }
    async initializeGpt4All() {
        try {
            this.logger.log('GPT4All not configured, using template-based fallback');
            this.gpt4allAvailable = false;
        }
        catch (error) {
            this.logger.warn('GPT4All initialization failed, using template fallback', error);
            this.gpt4allAvailable = false;
        }
    }
    isAiAvailable() {
        return this.gpt4allAvailable;
    }
    async generateSummary(lessonId) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                summaryCache: true,
            },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        if (lesson.summaryCache) {
            return {
                summary: lesson.summaryCache.summary,
                cached: true,
                aiGenerated: false,
            };
        }
        let summary;
        let aiGenerated = false;
        if (this.gpt4allAvailable) {
            try {
                summary = await this.generateAiSummary(lesson.content);
                aiGenerated = true;
            }
            catch (error) {
                this.logger.warn('AI summary generation failed, using template', error);
                summary = (0, summary_template_1.generateTemplateSummary)(lesson.content);
            }
        }
        else {
            summary = (0, summary_template_1.generateTemplateSummary)(lesson.content);
        }
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
    async generateQuizQuestions(lessonId) {
        const lesson = await this.lessonsService.findOne(lessonId);
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        let questions;
        let aiGenerated = false;
        if (this.gpt4allAvailable) {
            try {
                questions = await this.generateAiQuiz(lesson.content, lesson.title);
                aiGenerated = true;
            }
            catch (error) {
                this.logger.warn('AI quiz generation failed, using template', error);
                questions = (0, quiz_template_1.generateTemplateQuiz)(lesson.content, lesson.title);
            }
        }
        else {
            questions = (0, quiz_template_1.generateTemplateQuiz)(lesson.content, lesson.title);
        }
        return {
            questions,
            aiGenerated,
        };
    }
    async clearSummaryCache(lessonId) {
        await this.prisma.summaryCache.deleteMany({
            where: { lessonId },
        });
    }
    async generateAiSummary(content) {
        throw new Error('GPT4All not implemented');
    }
    async generateAiQuiz(_content, _title) {
        throw new Error('GPT4All not implemented');
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        lessons_service_1.LessonsService])
], AiService);
//# sourceMappingURL=ai.service.js.map