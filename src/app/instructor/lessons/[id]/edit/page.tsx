'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLesson } from '@/hooks/useLessons';
import { useUpdateLesson } from '@/hooks/useInstructor';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types';

const lessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  videoUrl: z.string().min(1, 'Video URL is required'),
  order: z.number().int().min(1, 'Order must be at least 1'),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface EditLessonPageProps {
  params: Promise<{ id: string }>;
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { data: lesson, isLoading: lessonLoading } = useLesson(id);
  const updateLesson = useUpdateLesson();
  const [isLoading, setIsLoading] = useState(false);


  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: '',
      content: '',
      videoUrl: '',
      order: 1,
    },
  });

  useEffect(() => {
    if (lesson) {
      form.reset({
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
      });
    }
  }, [lesson, form]);

  const onSubmit = async (data: LessonFormValues) => {
    setIsLoading(true);
    try {
      await updateLesson.mutateAsync({
        id,
        data: {
          title: data.title,
          content: data.content,
          videoUrl: data.videoUrl,
          order: data.order,
        },
      });
      
      toast({
        title: 'Lesson updated!',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message = axiosError.response?.data?.message || 'Failed to update lesson';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: Array.isArray(message) ? message[0] : message,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/instructor/courses/${lesson.courseId}/edit`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to Variables" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Content</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write the lesson content here..."
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/videos/lesson-1.mp4" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormDescription>Path to the video file</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Link href={`/instructor/courses/${lesson.courseId}/edit`}>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {lesson.quiz ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This lesson has a quiz with {lesson.quiz.questions?.length ?? 0} questions.
            </p>
            <Link href={`/instructor/quiz/${lesson.quiz.id}/edit`}>
              <Button variant="outline">Edit Quiz</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              No quiz has been created for this lesson yet.
            </p>
            <Link href={`/instructor/quiz/create?lessonId=${id}`}>
              <Button>Create Quiz</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
