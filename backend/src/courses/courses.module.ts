import { Module, forwardRef } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [PrismaModule, forwardRef(() => LessonsModule)],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
