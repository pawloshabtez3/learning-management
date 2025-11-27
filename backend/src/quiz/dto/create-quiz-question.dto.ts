import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
} from 'class-validator';

export class CreateQuizQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  question: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 options are required' })
  @ArrayMaxSize(6, { message: 'Maximum 6 options allowed' })
  @IsString({ each: true })
  options: string[];

  @IsInt()
  @Min(0, { message: 'Correct index must be 0 or greater' })
  correctIndex: number;

  @IsInt()
  @Min(1)
  order: number;
}
