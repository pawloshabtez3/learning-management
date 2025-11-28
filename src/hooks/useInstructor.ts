import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Course, Lesson, Quiz } from '@/types';

// Extended course type with enrollment count
export interface InstructorCourse extends Course {
  _count?: {
    enrollments: number;
    lessons: number;
  };
}

export function useInstructorCourses() {
  return useQuery<InstructorCourse[]>({
    queryKey: ['instructor', 'courses'],
    queryFn: async () => {
      const response = await api.get<InstructorCourse[]>('/courses/my-courses');
      return response.data;
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; description: string; thumbnail?: string; published?: boolean }) => {
      const response = await api.post<Course>('/courses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title?: string; description?: string; thumbnail?: string; published?: boolean } }) => {
      const response = await api.put<Course>(`/courses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}


export function useCreateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; content: string; videoUrl: string; order: number; courseId: string }) => {
      const response = await api.post<Lesson>('/lessons', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['instructor', 'courses'] });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title?: string; content?: string; videoUrl?: string; order?: number } }) => {
      const response = await api.put<Lesson>(`/lessons/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course'] });
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
    },
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { 
      lessonId: string; 
      questions: Array<{ question: string; options: string[]; correctIndex: number; order: number }> 
    }) => {
      const response = await api.post<Quiz>('/quiz', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson'] });
      queryClient.invalidateQueries({ queryKey: ['quiz'] });
    },
  });
}

export function useGenerateQuiz() {
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await api.post<{ questions: Array<{ question: string; options: string[]; correctIndex: number }> }>('/ai/generate-quiz', { lessonId });
      return response.data;
    },
  });
}
