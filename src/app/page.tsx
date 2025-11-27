'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Learn Smarter with{' '}
              <span className="text-primary">AI-Powered</span> Education
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access high-quality courses, track your progress, and get AI-generated 
              summaries to accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Our Platform?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon="📚"
                title="Quality Courses"
                description="Access a wide range of courses created by expert instructors covering various topics."
              />
              <FeatureCard
                icon="🤖"
                title="AI Summaries"
                description="Get instant AI-generated summaries of lessons to quickly review key concepts."
              />
              <FeatureCard
                icon="📊"
                title="Track Progress"
                description="Monitor your learning journey with detailed progress tracking and completion stats."
              />
              <FeatureCard
                icon="🎯"
                title="Interactive Quizzes"
                description="Test your knowledge with auto-graded quizzes and get immediate feedback."
              />
              <FeatureCard
                icon="🎬"
                title="Video Lessons"
                description="Learn at your own pace with high-quality video content and supporting materials."
              />
              <FeatureCard
                icon="💯"
                title="100% Free"
                description="All features are completely free. No hidden costs or premium tiers."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of learners and start your educational journey today.
            </p>
            <Link href="/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
