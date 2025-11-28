import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Course ID is required' })
  @IsUUID('4', { message: 'Course ID must be a valid UUID' })
  courseId: string;
}
