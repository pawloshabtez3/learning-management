'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, Plus, Trash2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLesson } from '@/hooks/useLessons';
import { useCreateQuiz, useGenerateQuiz } from '@/hooks/useInstructor';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  order: number;
}

const emptyQuestion = (): QuizQuestion => ({
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  order: 1,
});

function QuizCreationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lessonId');
  const { toast } = useToast();
  const { data: lesson, isLoading: lessonLoading } = useLesson(lessonId || '');
  const createQuiz = useCreateQuiz();
  const generateQuiz = useGenerateQuiz();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()]);


  const addQuestion = () => {
    if (questions.length >= 5) {
      toast({
        variant: 'destructive',
        title: 'Maximum questions reached',
        description: 'A quiz can have at most 5 questions.',
      });
      return;
    }
    setQuestions([...questions, { ...emptyQuestion(), order: questions.length + 1 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast({
        variant: 'destructive',
        title: 'Cannot remove',
        description: 'A quiz must have at least 1 question.',
      });
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    // Update order numbers
    setQuestions(newQuestions.map((q, i) => ({ ...q, order: i + 1 })));
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: string | number | string[]) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = value;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    setQuestions(newQuestions);
  };

  const handleGenerateQuiz = async () => {
    if (!lessonId) return;
    
    setIsGenerating(true);
    try {
      const result = await generateQuiz.mutateAsync(lessonId);
      if (result.questions && result.questions.length > 0) {
        setQuestions(result.questions.map((q, i) => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          order: i + 1,
        })));
        toast({
          title: 'Quiz generated!',
          description: 'AI has generated quiz questions. Review and edit as needed.',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Failed to generate quiz';
      toast({
        variant: 'destructive',
        title: 'Generation failed',
        description: Array.isArray(message) ? message[0] : message,
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const handleSubmit = async () => {
    if (!lessonId) return;

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast({
          variant: 'destructive',
          title: 'Validation error',
          description: `Question ${i + 1} is empty.`,
        });
        return;
      }
      const filledOptions = q.options.filter(o => o.trim());
      if (filledOptions.length < 2) {
        toast({
          variant: 'destructive',
          title: 'Validation error',
          description: `Question ${i + 1} needs at least 2 options.`,
        });
        return;
      }
      if (q.correctIndex >= filledOptions.length) {
        toast({
          variant: 'destructive',
          title: 'Validation error',
          description: `Question ${i + 1} has an invalid correct answer selection.`,
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      // Filter out empty options before submitting
      const cleanedQuestions = questions.map(q => ({
        ...q,
        options: q.options.filter(o => o.trim()),
      }));

      await createQuiz.mutateAsync({
        lessonId,
        questions: cleanedQuestions,
      });
      
      toast({
        title: 'Quiz created!',
        description: 'The quiz has been added to the lesson.',
      });
      
      router.push(`/instructor/lessons/${lessonId}/edit`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Failed to create quiz';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: Array.isArray(message) ? message[0] : message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!lessonId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">No lesson selected</p>
        <Link href="/instructor/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (lessonLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Lesson not found</p>
        <Link href="/instructor/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href={`/instructor/lessons/${lessonId}/edit`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lesson
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Quiz</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">For lesson: {lesson.title}</p>
            </div>
            <Button variant="outline" onClick={handleGenerateQuiz} disabled={isGenerating || isLoading}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI Generate
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <Card key={qIndex}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)} disabled={isLoading}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Question Text</label>
                <Input
                  placeholder="Enter your question..."
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Options</label>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctIndex === oIndex}
                        onChange={() => updateQuestion(qIndex, 'correctIndex', oIndex)}
                        disabled={isLoading}
                        className="h-4 w-4"
                      />
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Select the radio button next to the correct answer</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={addQuestion} disabled={isLoading || questions.length >= 5}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
        <div className="flex gap-4">
          <Link href={`/instructor/lessons/${lessonId}/edit`}>
            <Button variant="outline" disabled={isLoading}>Cancel</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CreateQuizPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <QuizCreationForm />
    </Suspense>
  );
}
