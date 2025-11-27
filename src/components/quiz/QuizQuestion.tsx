'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizQuestionProps {
  questionNumber: number;
  question: string;
  options: string[];
  selectedAnswer?: number;
  correctAnswer?: number;
  showResult?: boolean;
  onSelectAnswer: (index: number) => void;
  disabled?: boolean;
}

export function QuizQuestion({
  questionNumber,
  question,
  options,
  selectedAnswer,
  correctAnswer,
  showResult = false,
  onSelectAnswer,
  disabled = false,
}: QuizQuestionProps) {
  const getOptionStyle = (index: number) => {
    const baseStyle = 'w-full p-4 text-left rounded-lg border transition-all';
    
    if (showResult) {
      if (index === correctAnswer) {
        return `${baseStyle} bg-green-100 border-green-500 text-green-800`;
      }
      if (index === selectedAnswer && index !== correctAnswer) {
        return `${baseStyle} bg-red-100 border-red-500 text-red-800`;
      }
      return `${baseStyle} bg-muted/50 border-muted`;
    }
    
    if (selectedAnswer === index) {
      return `${baseStyle} bg-primary/10 border-primary`;
    }
    
    return `${baseStyle} hover:bg-muted/50 hover:border-muted-foreground/50`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Question {questionNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium">{question}</p>
        <div className="space-y-2">
          {options.map((option, index) => (
            <button
              key={index}
              className={getOptionStyle(index)}
              onClick={() => onSelectAnswer(index)}
              disabled={disabled || showResult}
            >
              <span className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {showResult && index === correctAnswer && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
                {showResult && index === selectedAnswer && index !== correctAnswer && (
                  <span className="ml-auto text-red-600">✗</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
