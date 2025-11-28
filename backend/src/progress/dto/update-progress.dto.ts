import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  @IsNotEmpty({ message: 'Lesson ID is required' })
  @IsUUID('4', { message: 'Lesson ID must be a valid UUID' })
  lessonId: string;

  @IsBoolean({ message: 'Completed must be a boolean value' })
  completed: boolean;
}
