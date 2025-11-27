import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateQuizDto {
  @IsString()
  @IsNotEmpty()
  lessonId: string;
}
