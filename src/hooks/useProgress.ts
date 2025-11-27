import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export interface SingleLessonProgress {
  id: string;
  completed: boolean;
  completedAt?: string;
  lessonId: string;
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

export function useLessonProgress(lessonId: string, enabled = true) {
  return useQuery<SingleLessonProgress | null>({
    queryKey: ['lesson-progress', lessonId],
    queryFn: async () => {
      try {
        const response = await api.get<SingleLessonProgress>(`/progress/lesson/${lessonId}`);
        return response.data;
      } catch {
        // Return null if no progress exists yet
        return null;
      }
    },
    enabled: enabled && !!lessonId,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ lessonId, completed }: { lessonId: string; completed: boolean }) => {
      const response = await api.post('/progress', { lessonId, completed });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate lesson progress
      queryClient.invalidateQueries({ queryKey: ['lesson-progress', variables.lessonId] });
      // Invalidate all course progress queries
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}
