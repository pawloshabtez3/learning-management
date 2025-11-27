import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Lesson } from '@/types';

interface AiSummaryResponse {
  lessonId: string;
  summary: string;
  cached: boolean;
  source: 'ai' | 'template' | 'cache';
}

export function useLesson(id: string) {
  return useQuery<Lesson>({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const response = await api.get<Lesson>(`/lessons/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useAiSummary(lessonId: string) {
  const queryClient = useQueryClient();

  return useMutation<AiSummaryResponse, Error, void>({
    mutationFn: async () => {
      const response = await api.post<AiSummaryResponse>('/ai/summarize', {
        lessonId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Cache the summary result
      queryClient.setQueryData(['ai-summary', lessonId], data);
    },
  });
}

export function useCachedSummary(lessonId: string) {
  return useQuery<AiSummaryResponse | null>({
    queryKey: ['ai-summary', lessonId],
    queryFn: () => null, // This is populated by mutation
    enabled: false, // Don't fetch automatically
    staleTime: Infinity, // Keep cached forever
  });
}
