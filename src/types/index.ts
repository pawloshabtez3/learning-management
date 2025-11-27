// Role enum matching Prisma schema
export type Role = 'STUDENT' | 'INSTRUCTOR';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  published: boolean;
  instructorId: string;
  instructor?: User;
  lessons?: Lesson[];
  enrollments?: Enrollment[];
  createdAt: string;
  updatedAt: string;
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  order: number;
  courseId: string;
  course?: Course;
  quiz?: Quiz;
  progress?: Progress[];
  createdAt: string;
  updatedAt: string;
}

// Enrollment types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  user?: User;
  course?: Course;
  enrolledAt: string;
}

// Progress types
export interface Progress {
  id: string;
  completed: boolean;
  completedAt?: string;
  userId: string;
  lessonId: string;
  user?: User;
  lesson?: Lesson;
}

// Quiz types
export interface Quiz {
  id: string;
  lessonId: string;
  lesson?: Lesson;
  questions?: QuizQuestion[];
  results?: QuizResult[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // Parsed from JSON
  correctIndex: number;
  order: number;
  quizId: string;
}

export interface QuizResult {
  id: string;
  score: number;
  totalQuestions: number;
  answers: number[]; // Parsed from JSON
  submittedAt: string;
  userId: string;
  quizId: string;
}

// Summary cache
export interface SummaryCache {
  id: string;
  summary: string;
  lessonId: string;
  createdAt: string;
}

// Auth types
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

// API Error response
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
}
