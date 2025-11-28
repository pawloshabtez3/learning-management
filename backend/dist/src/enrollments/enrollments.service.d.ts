import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto';
export declare class EnrollmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createEnrollmentDto: CreateEnrollmentDto, userId: string): Promise<{
        course: {
            id: string;
            title: string;
            description: string;
            thumbnail: string | null;
        };
    } & {
        id: string;
        courseId: string;
        enrolledAt: Date;
        userId: string;
    }>;
    findByUser(userId: string): Promise<({
        course: {
            id: string;
            _count: {
                lessons: number;
            };
            title: string;
            description: string;
            thumbnail: string | null;
            instructor: {
                name: string;
                id: string;
            };
        };
    } & {
        id: string;
        courseId: string;
        enrolledAt: Date;
        userId: string;
    })[]>;
    findOne(userId: string, courseId: string): Promise<({
        course: {
            id: string;
            title: string;
            description: string;
        };
    } & {
        id: string;
        courseId: string;
        enrolledAt: Date;
        userId: string;
    }) | null>;
    isEnrolled(userId: string, courseId: string): Promise<boolean>;
}
