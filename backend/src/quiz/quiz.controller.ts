import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, SubmitQuizDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/dto/register.dto';
import type { JwtPayload } from '../auth/auth.service';

@Controller('quiz')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.quizService.findByLesson(lessonId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizService.findById(id);
  }

  @Post()
  @Roles(Role.INSTRUCTOR)
  create(@Body() createQuizDto: CreateQuizDto, @CurrentUser() user: JwtPayload) {
    return this.quizService.create(createQuizDto, user.sub);
  }

  @Post('submit')
  @Roles(Role.STUDENT)
  submit(@Body() submitQuizDto: SubmitQuizDto, @CurrentUser() user: JwtPayload) {
    return this.quizService.submit(submitQuizDto, user.sub);
  }

  @Get(':id/result')
  getResult(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.quizService.getResult(id, user.sub);
  }
}
