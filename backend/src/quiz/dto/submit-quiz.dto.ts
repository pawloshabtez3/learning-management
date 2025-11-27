import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsInt,
} from 'class-validator';

export class SubmitQuizDto {
  @IsString()
  @IsNotEmpty({ message: 'Quiz ID is required' })
  quizId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least 1 answer is required' })
  @IsInt({ each: true, message: 'Each answer must be an integer index' })
  answers: number[];
}
