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
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/dto/register.dto';
import type { JwtPayload } from '../auth/auth.service';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Post()
  @Roles(Role.INSTRUCTOR)
  create(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.lessonsService.create(createLessonDto, user.sub);
  }

  @Put(':id')
  @Roles(Role.INSTRUCTOR)
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.lessonsService.update(id, updateLessonDto, user.sub);
  }

  @Delete(':id')
  @Roles(Role.INSTRUCTOR)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.lessonsService.remove(id, user.sub);
  }
}
