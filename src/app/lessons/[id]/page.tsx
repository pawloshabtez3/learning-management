interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Lesson Player</h1>
      {/* Lesson player will be implemented in task 10.1 */}
      <p className="text-muted-foreground">
        Lesson ID: {id}
      </p>
    </div>
  );
}
