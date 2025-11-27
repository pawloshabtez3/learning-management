interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>
      {/* Quiz page will be implemented in task 10.3 */}
      <p className="text-muted-foreground">
        Quiz ID: {id}
      </p>
    </div>
  );
}
