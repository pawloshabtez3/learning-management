import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/dto/register.dto';
import type { JwtPayload } from '../auth/auth.service';
import { LessonsService } from '../lessons/lessons.service';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly lessonsService: LessonsService,
  ) {}

  @Get()
  @Public()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('my-courses')
  @Roles(Role.INSTRUCTOR)
  findMyCourses(@CurrentUser() user: JwtPayload) {
    return this.coursesService.findByInstructor(user.sub);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get(':id/lessons')
  findCourseLessons(@Param('id') id: string) {
    return this.lessonsService.findByCourse(id);
  }

  @Post()
  @Roles(Role.INSTRUCTOR)
  create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.create(createCourseDto, user.sub);
  }


  @Put(':id')
  @Roles(Role.INSTRUCTOR)
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.update(id, updateCourseDto, user.sub);
  }

  @Delete(':id')
  @Roles(Role.INSTRUCTOR)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.coursesService.remove(id, user.sub);
  }
}
