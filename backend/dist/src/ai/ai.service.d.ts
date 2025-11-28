import { PrismaService } from '../prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';
import { GeneratedQuestion } from './templates/quiz.template';
export declare class AiService {
    private prisma;
    private lessonsService;
    private readonly logger;
    private gpt4allAvailable;
    constructor(prisma: PrismaService, lessonsService: LessonsService);
    private initializeGpt4All;
    isAiAvailable(): boolean;
    generateSummary(lessonId: string): Promise<{
        summary: string;
        cached: boolean;
        aiGenerated: boolean;
    }>;
    generateQuizQuestions(lessonId: string): Promise<{
        questions: GeneratedQuestion[];
        aiGenerated: boolean;
    }>;
    clearSummaryCache(lessonId: string): Promise<void>;
    private generateAiSummary;
    private generateAiQuiz;
}
