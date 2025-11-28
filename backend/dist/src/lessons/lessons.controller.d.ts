import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import type { JwtPayload } from '../auth/auth.service';
export declare class LessonsController {
    private readonly lessonsService;
    constructor(lessonsService: LessonsService);
    findOne(id: string): Promise<{
        course: {
            id: string;
            title: string;
            instructorId: string;
        };
        quiz: {
            id: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number;
        content: string;
        videoUrl: string;
        courseId: string;
    }>;
    create(createLessonDto: CreateLessonDto, user: JwtPayload): Promise<{
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number;
        content: string;
        videoUrl: string;
        courseId: string;
    }>;
    update(id: string, updateLessonDto: UpdateLessonDto, user: JwtPayload): Promise<{
        course: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        order: number;
        content: string;
        videoUrl: string;
        courseId: string;
    }>;
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
