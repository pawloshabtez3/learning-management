import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  order: number;
  quizId: string;
}

export interface QuizSubmission {
  quizId: string;
  answers: number[];
}

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  submittedAt: string;
  userId: string;
  quizId: string;
}

export function useQuiz(lessonId: string, enabled = true) {
  return useQuery<Quiz>({
    queryKey: ['quiz', lessonId],
    queryFn: async () => {
      const response = await api.get<Quiz>(`/quiz/lesson/${lessonId}`);
      return response.data;
    },
    enabled: enabled && !!lessonId,
  });
}

export function useQuizResult(quizId: string, enabled = true) {
  return useQuery<QuizResult | null>({
    queryKey: ['quiz-result', quizId],
    queryFn: async () => {
      try {
        const response = await api.get<QuizResult>(`/quiz/${quizId}/result`);
        return response.data;
      } catch {
        // Return null if no result exists yet
        return null;
      }
    },
    enabled: enabled && !!quizId,
  });
}


export function useSubmitQuiz() {
  const queryClient = useQueryClient();

  return useMutation<QuizResult, Error, QuizSubmission>({
    mutationFn: async (submission) => {
      const response = await api.post<QuizResult>('/quiz/submit', submission);
      return response.data;
    },
    onSuccess: (data) => {
      // Cache the result
      queryClient.setQueryData(['quiz-result', data.quizId], data);
    },
  });
}
