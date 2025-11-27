interface LessonContentProps {
  content: string;
}

// Placeholder - will be implemented in task 10.1
export function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="prose max-w-none">
      <p>{content}</p>
    </div>
  );
}
