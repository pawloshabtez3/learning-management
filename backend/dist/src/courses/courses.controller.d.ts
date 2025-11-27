import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import type { JwtPayload } from '../auth/auth.service';
import { LessonsService } from '../lessons/lessons.service';
export declare class CoursesController {
    private readonly coursesService;
    private readonly lessonsService;
    constructor(coursesService: CoursesService, lessonsService: LessonsService);
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
    findMyCourses(user: JwtPayload): Promise<({
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
    findCourseLessons(id: string): Promise<{
        id: string;
        title: string;
        order: number;
        videoUrl: string;
    }[]>;
    create(createCourseDto: CreateCourseDto, user: JwtPayload): Promise<{
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
    update(id: string, updateCourseDto: UpdateCourseDto, user: JwtPayload): Promise<{
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
    remove(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
