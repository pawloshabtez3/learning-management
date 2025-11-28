# **100% Free LMS MVP Prompt**

This prompt is ready to use in ChatGPT or any AI code generator to create a fully functional **100% free LMS MVP**, with **no paid services**, **local AI**, and **free hosting/storage**.

---

## **MVP PROMPT START**

I want to build a **Minimal Viable Product (MVP)** of an **AI-powered Learning Management System (LMS)** that is **completely free** to develop, run, and deploy. Replace all paid services with free alternatives. I want you to act as a **senior full-stack architect** and generate all necessary code, architecture, database, API routes, and frontend components.

---

# ✅ **Core Features (MVP)**

## **User Roles**
- Student
- Instructor

## **Student Features**
- Register & login (email + password)
- View available courses
- Enroll in a course
- Watch lessons (video player with local MP4 files)
- Basic progress tracking
- Simple quizzes (MCQ, auto-graded)
- AI summary button for lessons (using free local AI)

## **Instructor Features**
- Create a course
- Add lessons (title + video + text content)
- Create quizzes (5 questions)

## **AI Features**
- Lesson summaries using **local GPT4All or template-based logic**
- Quiz generation using local AI or templates

---

# 💻 **Frontend (Free Stack)**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- ShadCN UI
- Framer Motion (animations)
- React Query + Zustand (state management)
- Video.js for playing MP4/HLS videos

**Frontend Pages**
- Landing page, course list, course details
- Login / Register
- Student dashboard, lesson player, quiz page
- Instructor dashboard, create course, add lessons

---

# 🛠 **Backend (Free Stack)**
- Node.js + NestJS
- TypeScript
- Prisma ORM
- JWT auth + bcrypt
- class-validator for input validation
- Local queue / setTimeout for background tasks if needed

**Backend API Endpoints (MVP)**
- Auth: /auth/register, /auth/login
- Courses: GET /courses, GET /courses/:id, POST /courses
- Lessons: GET /lessons/:id, POST /lessons
- Quiz: GET /lessons/:id/quiz, POST /quiz/submit
- AI: POST /ai/summarize, POST /ai/generate-quiz

---

# 🗄 **Database (Free)**
- **SQLite** locally OR Supabase/Neon free tier
- Models: User, Course, Lesson, Enrollment, Quiz, QuizQuestion, Progress

---

# 📦 **Video / Storage (Free)**
- Host MP4 videos locally in `/public/videos`
- Playback with Video.js
- Optional: small file uploads to free storage (Supabase Storage free tier)

---

# 🤖 **AI (Free)**
- Use **GPT4All** (local LLM) or template-based AI for:
  - Lesson summaries
  - Quiz generation
- Cache outputs in memory or local SQLite/JSON for efficiency

---

# 🔐 **Security (Free)**
- JWT authentication
- httpOnly refresh tokens
- Password hashing with bcrypt
- Input validation and role-based guards
- HTTPS for deployed frontend via Vercel or mkcert locally

---

# 🌐 **Deployment (Free)**
- Frontend: Vercel free tier
- Backend: Railway / Render free tier or local dev
- Database: SQLite locally or Supabase/Neon free tier
- Videos: Serve locally or via free Supabase storage

---

# 🚀 **What I Want You to Generate**
1. Clean MVP architecture diagram
2. Folder structure for frontend + backend
3. Database schema (Prisma / SQLite)
4. Minimal API route definitions
5. Frontend pages and components
6. Backend boilerplate with authentication and endpoints
7. AI prompt templates for local AI summarization and quiz generation
8. Deployment plan for fully free stack

**Goal:** Produce a fully functional, 100% free LMS MVP that can run and be deployed without paying for any service.

## **MVP PROMPT END**

