# Design Document: AI-Powered LMS MVP

## Overview

This document outlines the technical design for a 100% free AI-powered Learning Management System. The architecture follows a modern full-stack approach with Next.js 14 frontend and NestJS backend, using SQLite for persistence and GPT4All for local AI capabilities.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js 14 (App Router)                     │   │
│  │  - TailwindCSS + ShadCN UI                              │   │
│  │  - React Query + Zustand                                │   │
│  │  - Video.js Player                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (HTTP/HTTPS)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    NestJS Backend                        │   │
│  │  - JWT Authentication                                   │   │
│  │  - Role-based Guards                                    │   │
│  │  - Input Validation (class-validator)                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Data Layer    │ │   AI Layer      │ │  Storage Layer  │
│  ┌───────────┐  │ │  ┌───────────┐  │ │  ┌───────────┐  │
│  │  SQLite   │  │ │  │  GPT4All  │  │ │  │  Local    │  │
│  │  (Prisma) │  │ │  │  (Local)  │  │ │  │  /public  │  │
│  └───────────┘  │ │  └───────────┘  │ │  │  /videos  │  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 | React framework with App Router |
| Styling | TailwindCSS + ShadCN UI | UI components and styling |
| State | React Query + Zustand | Server state + client state |
| Video | Video.js | MP4/HLS video playback |
| Animation | Framer Motion | UI animations |
| Backend | NestJS | Node.js framework |
| ORM | Prisma | Database access |
| Database | SQLite | Local file-based database |
| Auth | JWT + bcrypt | Authentication |
| AI | GPT4All | Local LLM for summaries/quizzes |

## Components and Interfaces

### Frontend Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (student)/
│   │   ├── dashboard/page.tsx
│   │   ├── courses/page.tsx
│   │   ├── courses/[id]/page.tsx
│   │   ├── lessons/[id]/page.tsx
│   │   └── quiz/[id]/page.tsx
│   ├── (instructor)/
│   │   ├── dashboard/page.tsx
│   │   ├── courses/create/page.tsx
│   │   ├── courses/[id]/edit/page.tsx
│   │   └── lessons/create/page.tsx
│   ├── layout.tsx
│   └── page.tsx (landing)
├── components/
│   ├── ui/ (ShadCN components)
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   ├── CourseList.tsx
│   │   └── CourseDetails.tsx
│   ├── lessons/
│   │   ├── LessonPlayer.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── LessonContent.tsx
│   ├── quiz/
│   │   ├── QuizQuestion.tsx
│   │   └── QuizResults.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── api.ts (API client)
│   ├── auth.ts (auth utilities)
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useCourses.ts
│   └── useQuiz.ts
└── store/
    └── authStore.ts (Zustand)
```

### Backend Structure

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       └── login.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   ├── courses/
│   │   ├── courses.module.ts
│   │   ├── courses.controller.ts
│   │   ├── courses.service.ts
│   │   └── dto/
│   │       ├── create-course.dto.ts
│   │       └── update-course.dto.ts
│   ├── lessons/
│   │   ├── lessons.module.ts
│   │   ├── lessons.controller.ts
│   │   ├── lessons.service.ts
│   │   └── dto/
│   ├── quiz/
│   │   ├── quiz.module.ts
│   │   ├── quiz.controller.ts
│   │   ├── quiz.service.ts
│   │   └── dto/
│   ├── progress/
│   │   ├── progress.module.ts
│   │   ├── progress.service.ts
│   │   └── dto/
│   ├── ai/
│   │   ├── ai.module.ts
│   │   ├── ai.controller.ts
│   │   ├── ai.service.ts
│   │   └── templates/
│   │       ├── summary.template.ts
│   │       └── quiz.template.ts
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── prisma/
│   └── schema.prisma
└── public/
    └── videos/
```

### API Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /auth/register | Register new user | No | - |
| POST | /auth/login | Login user | No | - |
| POST | /auth/refresh | Refresh token | Yes | - |
| GET | /courses | List all courses | No | - |
| GET | /courses/:id | Get course details | No | - |
| POST | /courses | Create course | Yes | Instructor |
| PUT | /courses/:id | Update course | Yes | Instructor |
| DELETE | /courses/:id | Delete course | Yes | Instructor |
| GET | /courses/:id/lessons | Get course lessons | Yes | - |
| GET | /lessons/:id | Get lesson details | Yes | - |
| POST | /lessons | Create lesson | Yes | Instructor |
| PUT | /lessons/:id | Update lesson | Yes | Instructor |
| POST | /enrollments | Enroll in course | Yes | Student |
| GET | /enrollments | Get user enrollments | Yes | Student |
| GET | /lessons/:id/quiz | Get quiz for lesson | Yes | Student |
| POST | /quiz | Create quiz | Yes | Instructor |
| POST | /quiz/submit | Submit quiz answers | Yes | Student |
| GET | /progress/:courseId | Get course progress | Yes | Student |
| POST | /progress | Update progress | Yes | Student |
| POST | /ai/summarize | Generate lesson summary | Yes | - |
| POST | /ai/generate-quiz | Generate quiz questions | Yes | Instructor |

## Data Models

### Prisma Schema

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  STUDENT
  INSTRUCTOR
}

model User {
  id           String       @id @default(uuid())
  email        String       @unique
  password     String
  name         String
  role         Role         @default(STUDENT)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  courses      Course[]     @relation("InstructorCourses")
  enrollments  Enrollment[]
  progress     Progress[]
  quizResults  QuizResult[]
}

model Course {
  id           String       @id @default(uuid())
  title        String
  description  String
  thumbnail    String?
  published    Boolean      @default(false)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  instructorId String
  instructor   User         @relation("InstructorCourses", fields: [instructorId], references: [id])
  
  lessons      Lesson[]
  enrollments  Enrollment[]
}

model Lesson {
  id           String       @id @default(uuid())
  title        String
  content      String
  videoUrl     String
  order        Int
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  
  courseId     String
  course       Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  quiz         Quiz?
  progress     Progress[]
  summaryCache SummaryCache?
}

model Enrollment {
  id           String       @id @default(uuid())
  enrolledAt   DateTime     @default(now())
  
  userId       String
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  courseId     String
  course       Course       @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  @@unique([userId, courseId])
}

model Progress {
  id           String       @id @default(uuid())
  completed    Boolean      @default(false)
  completedAt  DateTime?
  
  userId       String
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  lessonId     String
  lesson       Lesson       @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  @@unique([userId, lessonId])
}

model Quiz {
  id           String         @id @default(uuid())
  createdAt    DateTime       @default(now())
  
  lessonId     String         @unique
  lesson       Lesson         @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  questions    QuizQuestion[]
  results      QuizResult[]
}

model QuizQuestion {
  id           String       @id @default(uuid())
  question     String
  options      String       // JSON array of options
  correctIndex Int
  order        Int
  
  quizId       String
  quiz         Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
}

model QuizResult {
  id           String       @id @default(uuid())
  score        Int
  totalQuestions Int
  answers      String       // JSON array of user answers
  submittedAt  DateTime     @default(now())
  
  userId       String
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  quizId       String
  quiz         Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  
  @@unique([userId, quizId])
}

model SummaryCache {
  id           String       @id @default(uuid())
  summary      String
  createdAt    DateTime     @default(now())
  
  lessonId     String       @unique
  lesson       Lesson       @relation(fields: [lessonId], references: [id], onDelete: Cascade)
}
```

### Entity Relationships

```
User (1) ──────< (N) Course (Instructor creates courses)
User (1) ──────< (N) Enrollment (Student enrolls)
Course (1) ────< (N) Enrollment
Course (1) ────< (N) Lesson
Lesson (1) ────< (1) Quiz
Quiz (1) ──────< (N) QuizQuestion
User (1) ──────< (N) Progress
Lesson (1) ────< (N) Progress
User (1) ──────< (N) QuizResult
Quiz (1) ──────< (N) QuizResult
Lesson (1) ────< (1) SummaryCache
```

## Error Handling

### HTTP Error Responses

| Status Code | Usage |
|-------------|-------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource (e.g., enrollment) |
| 500 | Internal Server Error |

### Error Response Format

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
}
```

### Backend Exception Filters

```typescript
// Global exception filter for consistent error responses
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';
    
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Frontend Error Handling

- React Query handles API errors with retry logic
- Toast notifications for user-facing errors
- Error boundaries for component-level failures
- Graceful degradation for AI features

## AI Integration

### GPT4All Integration

```typescript
// ai.service.ts
@Injectable()
export class AiService {
  private model: GPT4All | null = null;
  
  async initialize() {
    try {
      this.model = await loadModel('ggml-gpt4all-j-v1.3-groovy');
    } catch (error) {
      console.warn('GPT4All not available, using templates');
    }
  }
  
  async generateSummary(lessonContent: string): Promise<string> {
    // Check cache first
    const cached = await this.getCachedSummary(lessonId);
    if (cached) return cached;
    
    if (this.model) {
      const prompt = `Summarize this lesson in 3-5 bullet points:\n\n${lessonContent}`;
      return await this.model.generate(prompt);
    }
    
    // Fallback to template-based summary
    return this.generateTemplateSummary(lessonContent);
  }
  
  async generateQuizQuestions(lessonContent: string): Promise<QuizQuestion[]> {
    if (this.model) {
      const prompt = `Generate 5 multiple choice questions based on:\n\n${lessonContent}`;
      const response = await this.model.generate(prompt);
      return this.parseQuizResponse(response);
    }
    
    // Fallback to template questions
    return this.generateTemplateQuiz(lessonContent);
  }
}
```

### Template Fallbacks

```typescript
// templates/summary.template.ts
export function generateTemplateSummary(content: string): string {
  const sentences = content.split('.').filter(s => s.trim().length > 20);
  const keyPoints = sentences.slice(0, 5);
  return `Key Points:\n${keyPoints.map(p => `• ${p.trim()}`).join('\n')}`;
}

// templates/quiz.template.ts
export function generateTemplateQuiz(content: string): QuizQuestion[] {
  // Extract key terms and generate basic comprehension questions
  const terms = extractKeyTerms(content);
  return terms.slice(0, 5).map((term, i) => ({
    question: `What is the main concept related to "${term}"?`,
    options: generateOptions(term, content),
    correctIndex: 0,
    order: i + 1,
  }));
}
```

## Testing Strategy

### Unit Tests
- Service layer tests with mocked dependencies
- Controller tests with mocked services
- Utility function tests

### Integration Tests
- API endpoint tests with test database
- Authentication flow tests
- Quiz submission and grading tests

### Frontend Tests
- Component rendering tests
- Form validation tests
- API integration tests with MSW

### Test Tools
- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library
- E2E: Playwright (optional)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Free Tier)                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend                          │ │
│  │         (Static + Server Components)                   │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Railway/Render (Free Tier)                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              NestJS Backend                            │ │
│  │         + SQLite + GPT4All                            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Environment Variables

```env
# Backend
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:3001"
```
