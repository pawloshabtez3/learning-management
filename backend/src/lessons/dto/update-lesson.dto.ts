import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;
}
