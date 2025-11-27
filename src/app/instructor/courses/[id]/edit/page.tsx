interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
      {/* Course edit form will be implemented in later tasks */}
      <p className="text-muted-foreground">
        Course ID: {id}
      </p>
    </div>
  );
}
