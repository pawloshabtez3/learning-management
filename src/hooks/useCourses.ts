import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Course } from '@/types';

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await api.get<Course[]>('/courses');
      return response.data;
    },
  });
}

export function useCourse(id: string) {
  return useQuery<Course>({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await api.get<Course>(`/courses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSearchCourses(searchTerm: string) {
  return useQuery<Course[]>({
    queryKey: ['courses', 'search', searchTerm],
    queryFn: async () => {
      const response = await api.get<Course[]>('/courses');
      const courses = response.data;
      
      if (!searchTerm.trim()) {
        return courses;
      }
      
      const term = searchTerm.toLowerCase();
      return courses.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term) ||
          course.instructor?.name?.toLowerCase().includes(term)
      );
    },
  });
}
