import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/dto/register.dto';
import type { JwtPayload } from '../auth/auth.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(Role.STUDENT)
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.enrollmentsService.create(createEnrollmentDto, user.sub);
  }

  @Get()
  @Roles(Role.STUDENT)
  findAll(@CurrentUser() user: JwtPayload) {
    return this.enrollmentsService.findByUser(user.sub);
  }

  @Get('check/:courseId')
  @Roles(Role.STUDENT)
  checkEnrollment(
    @Param('courseId') courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.enrollmentsService.isEnrolled(user.sub, courseId);
  }
}
