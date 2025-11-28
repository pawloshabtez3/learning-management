import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        },
        quiz: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async findByCourse(courseId: string) {
    return this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        videoUrl: true,
      },
    });
  }


  async create(createLessonDto: CreateLessonDto, userId: string) {
    // Verify the course exists and belongs to the instructor
    const course = await this.prisma.course.findUnique({
      where: { id: createLessonDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only add lessons to your own courses');
    }

    // If no order specified, add to end
    let order = createLessonDto.order;
    if (!order) {
      const lastLesson = await this.prisma.lesson.findFirst({
        where: { courseId: createLessonDto.courseId },
        orderBy: { order: 'desc' },
      });
      order = lastLesson ? lastLesson.order + 1 : 1;
    }

    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        content: createLessonDto.content,
        videoUrl: createLessonDto.videoUrl,
        order,
        courseId: createLessonDto.courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async update(id: string, updateLessonDto: UpdateLessonDto, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.course.instructorId !== userId) {
      throw new ForbiddenException('You can only update lessons in your own courses');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete lessons from your own courses');
    }

    await this.prisma.lesson.delete({
      where: { id },
    });

    return { message: 'Lesson deleted successfully' };
  }
}
