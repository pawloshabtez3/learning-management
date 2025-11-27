interface QuizResultsProps {
  score: number;
  total: number;
}

// Placeholder - will be implemented in task 10.3
export function QuizResults({ score, total }: QuizResultsProps) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold">
        {score} / {total}
      </p>
      <p className="text-muted-foreground">Quiz completed</p>
    </div>
  );
}
