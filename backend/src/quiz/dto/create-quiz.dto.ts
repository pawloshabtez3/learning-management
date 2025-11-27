import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuizQuestionDto } from './create-quiz-question.dto';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty({ message: 'Lesson ID is required' })
  lessonId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least 1 question is required' })
  @ArrayMaxSize(5, { message: 'Maximum 5 questions allowed per quiz' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuizQuestionDto)
  questions: CreateQuizQuestionDto[];
}
