import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Course } from '@/types';

// Hook for fetching courses
// Will be fully implemented in task 9.2
export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => api.get<Course[]>('/courses'),
  });
}

export function useCourse(id: string) {
  return useQuery<Course>({
    queryKey: ['course', id],
    queryFn: () => api.get<Course>(`/courses/${id}`),
    enabled: !!id,
  });
}
