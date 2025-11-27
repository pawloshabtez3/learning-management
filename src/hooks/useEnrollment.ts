import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Enrollment } from '@/types';

export function useEnrollments() {
  return useQuery<Enrollment[]>({
    queryKey: ['enrollments'],
    queryFn: async () => {
      const response = await api.get<Enrollment[]>('/enrollments');
      return response.data;
    },
  });
}

export function useCheckEnrollment(courseId: string, enabled = true) {
  return useQuery<boolean>({
    queryKey: ['enrollment', 'check', courseId],
    queryFn: async () => {
      const response = await api.get<boolean>(`/enrollments/check/${courseId}`);
      return response.data;
    },
    enabled: enabled && !!courseId,
  });
}

export function useEnroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await api.post<Enrollment>('/enrollments', { courseId });
      return response.data;
    },
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment', 'check', courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
    },
  });
}
