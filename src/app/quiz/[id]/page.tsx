'use client';

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuizQuestion } from '@/components/quiz/QuizQuestion';
import { QuizResults } from '@/components/quiz/QuizResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuiz, useSubmitQuiz, useQuizResult } from '@/hooks/useQuiz';
import { useLesson } from '@/hooks/useLessons';
import { useAuthStore } from '@/store/authStore';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { id: lessonId } = use(params);
  const { isAuthenticated, user } = useAuthStore();
  const isStudent = user?.role === 'STUDENT';

  const { data: lesson } = useLesson(lessonId);
  const { data: quiz, isLoading, error } = useQuiz(lessonId, isAuthenticated);
  const { data: existingResult } = useQuizResult(quiz?.id ?? '', isAuthenticated && !!quiz?.id);
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{ score: number; total: number } | null>(null);

  const submitMutation = useSubmitQuiz();

  const handleSelectAnswer = useCallback((questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  }, []);

  const handleSubmit = async () => {
    if (!quiz) return;

    const sortedQuestions = [...quiz.questions].sort((a, b) => a.order - b.order);
    const answerArray = sortedQuestions.map((q) => answers[q.id] ?? -1);

    // Check if all questions are answered
    if (answerArray.includes(-1)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      const result = await submitMutation.mutateAsync({
        quizId: quiz.id,
        answers: answerArray,
      });
      setSubmittedResult({ score: result.score, total: result.totalQuestions });
      setShowResults(true);
    } catch {
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setShowResults(false);
    setSubmittedResult(null);
  };

  const allQuestionsAnswered = quiz
    ? quiz.questions.every((q) => answers[q.id] !== undefined)
    : false;

  // Show existing result if available
  const displayResult = submittedResult ?? (existingResult ? {
    score: existingResult.score,
    total: existingResult.totalQuestions,
  } : null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto py-6 px-4 max-w-3xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href={`/lessons/${lessonId}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Back to Lesson
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && <QuizSkeleton />}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-destructive mb-4">Failed to load quiz.</p>
            <Link href={`/lessons/${lessonId}`}>
              <Button variant="outline">Back to Lesson</Button>
            </Link>
          </div>
        )}


        {/* Auth Check */}
        {!isAuthenticated && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔒</div>
            <p className="text-muted-foreground mb-4">
              Please sign in to take this quiz.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        )}

        {/* No Quiz Available */}
        {!isLoading && !error && isAuthenticated && !quiz && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-muted-foreground mb-4">
              No quiz available for this lesson yet.
            </p>
            <Link href={`/lessons/${lessonId}`}>
              <Button variant="outline">Back to Lesson</Button>
            </Link>
          </div>
        )}

        {/* Quiz Content */}
        {quiz && isAuthenticated && (
          <div className="space-y-6">
            {/* Quiz Header */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {lesson?.title ? `Quiz: ${lesson.title}` : 'Lesson Quiz'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {quiz.questions.length} questions • {isStudent ? 'Answer all questions to submit' : 'Preview mode'}
                </p>
              </CardContent>
            </Card>


            {/* Show Results or Questions */}
            {showResults && displayResult ? (
              <QuizResults
                score={displayResult.score}
                total={displayResult.total}
                lessonId={lessonId}
                courseId={lesson?.courseId}
                onRetry={isStudent ? handleRetry : undefined}
              />
            ) : existingResult && !showResults ? (
              // Show previous result with option to retake
              <div className="space-y-6">
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      You&apos;ve already completed this quiz with a score of{' '}
                      <span className="font-bold">{existingResult.score}/{existingResult.totalQuestions}</span>
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button onClick={handleRetry}>Retake Quiz</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Show Questions
              <div className="space-y-4">
                {[...quiz.questions]
                  .sort((a, b) => a.order - b.order)
                  .map((question, index) => (
                    <QuizQuestion
                      key={question.id}
                      questionNumber={index + 1}
                      question={question.question}
                      options={question.options}
                      selectedAnswer={answers[question.id]}
                      onSelectAnswer={(answerIndex) =>
                        handleSelectAnswer(question.id, answerIndex)
                      }
                      disabled={!isStudent}
                    />
                  ))}

                {/* Submit Button */}
                {isStudent && (
                  <div className="flex justify-end pt-4">
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={!allQuestionsAnswered || submitMutation.isPending}
                    >
                      {submitMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


function QuizSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="rounded-xl border p-6 space-y-2">
        <div className="h-7 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>

      {/* Question Skeletons */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border p-6 space-y-4">
          <div className="h-5 bg-muted rounded w-1/4" />
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
