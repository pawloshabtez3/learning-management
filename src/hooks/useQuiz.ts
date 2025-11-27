import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';

interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  order: number;
}

interface QuizSubmission {
  quizId: string;
  answers: number[];
}

interface QuizResult {
  score: number;
  totalQuestions: number;
}

// Hook for quiz functionality
// Will be fully implemented in task 10.3
export function useQuiz(lessonId: string) {
  return useQuery<Quiz>({
    queryKey: ['quiz', lessonId],
    queryFn: () => api.get<Quiz>(`/lessons/${lessonId}/quiz`),
    enabled: !!lessonId,
  });
}

export function useSubmitQuiz() {
  return useMutation<QuizResult, Error, QuizSubmission>({
    mutationFn: (submission) => api.post<QuizResult>('/quiz/submit', submission),
  });
}
