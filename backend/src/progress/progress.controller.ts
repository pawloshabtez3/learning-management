import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/dto/register.dto';
import type { JwtPayload } from '../auth/auth.service';

@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @Roles(Role.STUDENT)
  updateProgress(
    @Body() updateProgressDto: UpdateProgressDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.progressService.updateProgress(updateProgressDto, user.sub);
  }

  @Get(':courseId')
  @Roles(Role.STUDENT)
  getCourseProgress(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.progressService.getCourseProgress(courseId, user.sub);
  }

  @Get('lesson/:lessonId')
  @Roles(Role.STUDENT)
  getLessonProgress(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.progressService.getLessonProgress(lessonId, user.sub);
  }
}
