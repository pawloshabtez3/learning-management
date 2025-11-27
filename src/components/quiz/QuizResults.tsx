'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuizResultsProps {
  score: number;
  total: number;
  lessonId?: string;
  courseId?: string;
  onRetry?: () => void;
}

export function QuizResults({
  score,
  total,
  lessonId,
  courseId,
  onRetry,
}: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);
  const isPassing = percentage >= 70;

  const getGradeEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 70) return '✅';
    if (percentage >= 50) return '📚';
    return '💪';
  };

  const getGradeMessage = () => {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Good work!';
    if (percentage >= 50) return 'Keep practicing!';
    return 'Don\'t give up!';
  };

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="space-y-2">
          <div className="text-6xl">{getGradeEmoji()}</div>
          <div className="text-4xl font-bold">
            {score} / {total}
          </div>
          <div className="text-xl text-muted-foreground">
            {percentage}%
          </div>
          <p className={`text-lg font-medium ${isPassing ? 'text-green-600' : 'text-amber-600'}`}>
            {getGradeMessage()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isPassing ? 'bg-green-500' : 'bg-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              🔄 Try Again
            </Button>
          )}
          {lessonId && (
            <Link href={`/lessons/${lessonId}`}>
              <Button variant="outline">
                ← Back to Lesson
              </Button>
            </Link>
          )}
          {courseId && (
            <Link href={`/courses/${courseId}`}>
              <Button>
                Continue Course →
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
