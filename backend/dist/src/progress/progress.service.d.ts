import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    updateProgress(updateProgressDto: UpdateProgressDto, userId: string): Promise<{
        lesson: {
            id: string;
            title: string;
            courseId: string;
        };
    } & {
        id: string;
        lessonId: string;
        userId: string;
        completed: boolean;
        completedAt: Date | null;
    }>;
    getCourseProgress(courseId: string, userId: string): Promise<{
        courseId: string;
        totalLessons: number;
        completedLessons: number;
        completionPercentage: number;
        lessons: {
            id: string;
            title: string;
            order: number;
            completed: boolean;
            completedAt: Date | null;
        }[];
    }>;
    getLessonProgress(lessonId: string, userId: string): Promise<{
        lessonId: string;
        completed: boolean;
        completedAt: Date | null;
    }>;
}
