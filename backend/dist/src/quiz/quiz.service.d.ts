import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto, SubmitQuizDto } from './dto';
export declare class QuizService {
    private prisma;
    constructor(prisma: PrismaService);
    findByLesson(lessonId: string): Promise<{
        questions: {
            options: any;
            id: string;
            order: number;
            question: string;
        }[];
        id: string;
        createdAt: Date;
        lessonId: string;
    }>;
    findById(id: string): Promise<{
        lesson: {
            course: {
                id: string;
                instructorId: string;
            };
            id: string;
            title: string;
        };
        questions: {
            id: string;
            order: number;
            question: string;
            options: string;
            correctIndex: number;
            quizId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        lessonId: string;
    }>;
    create(createQuizDto: CreateQuizDto, userId: string): Promise<{
        questions: {
            id: string;
            order: number;
            question: string;
            options: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        lessonId: string;
    }>;
    submit(submitQuizDto: SubmitQuizDto, userId: string): Promise<{
        id: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        submittedAt: Date;
    }>;
    getResult(quizId: string, userId: string): Promise<{
        id: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        answers: any;
        submittedAt: Date;
        questions: {
            id: string;
            question: string;
            options: any;
            correctIndex: number;
        }[];
    }>;
}
