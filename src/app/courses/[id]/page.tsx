interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Course Details</h1>
      {/* Course details will be implemented in task 9.3 */}
      <p className="text-muted-foreground">
        Course ID: {id}
      </p>
    </div>
  );
}
