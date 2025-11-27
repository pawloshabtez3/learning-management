'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { VideoPlayer } from './VideoPlayer';
import { LessonContent } from './LessonContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Lesson } from '@/types';

interface LessonPlayerProps {
  lesson: Lesson;
  isCompleted?: boolean;
  onComplete?: () => void;
  onProgressUpdate?: (progress: number) => void;
}

export function LessonPlayer({
  lesson,
  isCompleted = false,
  onComplete,
  onProgressUpdate,
}: LessonPlayerProps) {
  const [hasEnded, setHasEnded] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);

  const handleVideoEnded = useCallback(() => {
    setHasEnded(true);
    if (!isCompleted) {
      onComplete?.();
    }
  }, [isCompleted, onComplete]);

  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      if (duration > 0) {
        const progress = Math.round((currentTime / duration) * 100);
        setWatchProgress(progress);
        onProgressUpdate?.(progress);
      }
    },
    [onProgressUpdate]
  );

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative">
        <VideoPlayer
          src={lesson.videoUrl}
          onEnded={handleVideoEnded}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Completion Badge */}
        {(isCompleted || hasEnded) && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            ✓ Completed
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Watch Progress</span>
          <span>{watchProgress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${watchProgress}%` }}
          />
        </div>
      </div>

      {/* Lesson Info */}
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Lesson {lesson.order}</span>
            {lesson.quiz && (
              <Link href={`/quiz/${lesson.id}`}>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  📝 Take Quiz
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Content with AI Summary */}
      <LessonContent lessonId={lesson.id} content={lesson.content} />
    </div>
  );
}
