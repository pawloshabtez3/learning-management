import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        instructor: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        published: boolean;
        instructorId: string;
    })[]>;
    findOne(id: string): Promise<{
        instructor: {
            email: string;
            name: string;
            id: string;
        };
        lessons: {
            id: string;
            title: string;
            order: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        published: boolean;
        instructorId: string;
    }>;
    findByInstructor(instructorId: string): Promise<({
        _count: {
            enrollments: number;
            lessons: number;
        };
        instructor: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        published: boolean;
        instructorId: string;
    })[]>;
    create(createCourseDto: CreateCourseDto, instructorId: string): Promise<{
        instructor: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        published: boolean;
        instructorId: string;
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto, userId: string): Promise<{
        instructor: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        thumbnail: string | null;
        published: boolean;
        instructorId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
