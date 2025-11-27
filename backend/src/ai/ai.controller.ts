import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { SummarizeDto, GenerateQuizDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/dto/register.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * Get AI service status
   */
  @Get('status')
  getStatus() {
    return {
      available: this.aiService.isAiAvailable(),
      fallbackEnabled: true,
      message: this.aiService.isAiAvailable()
        ? 'AI service is available'
        : 'Using template-based fallback',
    };
  }

  /**
   * Generate a summary for a lesson
   * Available to all authenticated users
   */
  @Post('summarize')
  async summarize(@Body() summarizeDto: SummarizeDto) {
    const result = await this.aiService.generateSummary(summarizeDto.lessonId);
    return {
      lessonId: summarizeDto.lessonId,
      ...result,
    };
  }

  /**
   * Generate quiz questions for a lesson
   * Only available to instructors
   */
  @Post('generate-quiz')
  @Roles(Role.INSTRUCTOR)
  async generateQuiz(@Body() generateQuizDto: GenerateQuizDto) {
    const result = await this.aiService.generateQuizQuestions(generateQuizDto.lessonId);
    return {
      lessonId: generateQuizDto.lessonId,
      ...result,
    };
  }
}
