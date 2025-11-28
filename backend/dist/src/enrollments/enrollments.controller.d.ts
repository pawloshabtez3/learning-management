import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto';
import type { JwtPayload } from '../auth/auth.service';
export declare class EnrollmentsController {
    private readonly enrollmentsService;
    constructor(enrollmentsService: EnrollmentsService);
    create(createEnrollmentDto: CreateEnrollmentDto, user: JwtPayload): Promise<{
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
    findAll(user: JwtPayload): Promise<({
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
    checkEnrollment(courseId: string, user: JwtPayload): Promise<boolean>;
}
