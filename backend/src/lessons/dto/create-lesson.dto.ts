import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsString()
  @IsNotEmpty({ message: 'Video URL is required' })
  videoUrl: string;

  @IsString()
  @IsNotEmpty({ message: 'Course ID is required' })
  courseId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;
}
