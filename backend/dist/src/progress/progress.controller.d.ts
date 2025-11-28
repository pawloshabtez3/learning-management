import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto';
import type { JwtPayload } from '../auth/auth.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    updateProgress(updateProgressDto: UpdateProgressDto, user: JwtPayload): Promise<{
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
    getCourseProgress(courseId: string, user: JwtPayload): Promise<{
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
    getLessonProgress(lessonId: string, user: JwtPayload): Promise<{
        lessonId: string;
        completed: boolean;
        completedAt: Date | null;
    }>;
}
