export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Header/Sidebar will be implemented in later tasks */}
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
