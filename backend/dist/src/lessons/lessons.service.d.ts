import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findByCourse(courseId: string): Promise<{
        id: string;
        title: string;
        order: number;
        videoUrl: string;
    }[]>;
    create(createLessonDto: CreateLessonDto, userId: string): Promise<{
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
    update(id: string, updateLessonDto: UpdateLessonDto, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
