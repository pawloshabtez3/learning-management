export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI-Powered LMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
