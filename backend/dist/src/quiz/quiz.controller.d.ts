import { QuizService } from './quiz.service';
import { CreateQuizDto, SubmitQuizDto } from './dto';
import type { JwtPayload } from '../auth/auth.service';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
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
    findOne(id: string): Promise<{
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
    create(createQuizDto: CreateQuizDto, user: JwtPayload): Promise<{
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
    submit(submitQuizDto: SubmitQuizDto, user: JwtPayload): Promise<{
        id: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        submittedAt: Date;
    }>;
    getResult(id: string, user: JwtPayload): Promise<{
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
