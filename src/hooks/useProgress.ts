import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lessons: LessonProgress[];
}

export interface LessonProgress {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  completedAt?: string;
}

export function useCourseProgress(courseId: string, enabled = true) {
  return useQuery<CourseProgress>({
    queryKey: ['progress', courseId],
    queryFn: async () => {
      const response = await api.get<CourseProgress>(`/progress/${courseId}`);
      return response.data;
    },
    enabled: enabled && !!courseId,
  });
}
