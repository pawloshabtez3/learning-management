'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAiSummary } from '@/hooks/useLessons';

interface LessonContentProps {
  lessonId: string;
  content: string;
}

export function LessonContent({ lessonId, content }: LessonContentProps) {
  const [showSummary, setShowSummary] = useState(false);
  const summaryMutation = useAiSummary(lessonId);

  const handleGenerateSummary = async () => {
    if (!summaryMutation.data) {
      await summaryMutation.mutateAsync();
    }
    setShowSummary(true);
  };

  return (
    <div className="space-y-6">
      {/* AI Summary Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">AI Summary</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateSummary}
              disabled={summaryMutation.isPending}
            >
              {summaryMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Generating...
                </>
              ) : summaryMutation.data ? (
                showSummary ? 'Hide Summary' : 'Show Summary'
              ) : (
                '✨ Generate Summary'
              )}
            </Button>
          </div>
        </CardHeader>
        {showSummary && summaryMutation.data && (
          <CardContent className="pt-0">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm whitespace-pre-wrap">{summaryMutation.data.summary}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {summaryMutation.data.cached ? '📦 Cached' : '✨ Generated'} via {summaryMutation.data.source}
              </p>
            </div>
          </CardContent>
        )}
        {summaryMutation.isError && (
          <CardContent className="pt-0">
            <p className="text-sm text-destructive">
              Failed to generate summary. Please try again.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
