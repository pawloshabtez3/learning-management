# Requirements Document

## Introduction

This document defines the requirements for a 100% free AI-powered Learning Management System (LMS) MVP. The system enables students to browse, enroll in, and complete courses with video lessons and quizzes, while instructors can create and manage course content. AI features provide lesson summaries and quiz generation using local/free AI solutions. The entire stack uses free technologies for development, hosting, and deployment.

## Glossary

- **LMS**: Learning Management System - a platform for delivering and managing educational content
- **Student**: A user who enrolls in and consumes course content
- **Instructor**: A user who creates and manages courses, lessons, and quizzes
- **Course**: A collection of lessons organized around a specific topic
- **Lesson**: An individual learning unit containing video and text content
- **Quiz**: A set of multiple-choice questions to assess student understanding
- **Enrollment**: The association between a student and a course they have joined
- **Progress**: Tracking data indicating a student's completion status within a course
- **GPT4All**: A free, locally-run large language model for AI features
- **JWT**: JSON Web Token - a standard for secure authentication tokens

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a user, I want to register and log in with email and password, so that I can access the LMS with my personal account.

#### Acceptance Criteria

1. WHEN a user submits valid registration data (email, password, role), THE LMS SHALL create a new user account and return a success confirmation within 2 seconds.
2. WHEN a user submits login credentials, THE LMS SHALL validate the credentials and return a JWT access token if valid.
3. IF a user submits invalid or duplicate registration data, THEN THE LMS SHALL return a descriptive error message without creating an account.
4. IF a user submits incorrect login credentials, THEN THE LMS SHALL return an authentication error without revealing which field was incorrect.
5. WHILE a user session is active, THE LMS SHALL provide an httpOnly refresh token mechanism to maintain authentication.

### Requirement 2: Course Browsing and Enrollment

**User Story:** As a student, I want to browse available courses and enroll in them, so that I can access learning content.

#### Acceptance Criteria

1. WHEN a student requests the course list, THE LMS SHALL return all published courses with title, description, and instructor name.
2. WHEN a student views a course detail page, THE LMS SHALL display the course information, lesson list, and enrollment status.
3. WHEN a student enrolls in a course, THE LMS SHALL create an enrollment record and grant access to course content.
4. IF a student attempts to enroll in a course they are already enrolled in, THEN THE LMS SHALL return an informative message without creating a duplicate enrollment.

### Requirement 3: Lesson Consumption and Progress Tracking

**User Story:** As a student, I want to watch video lessons and track my progress, so that I can learn at my own pace and see my advancement.

#### Acceptance Criteria

1. WHEN a student accesses a lesson, THE LMS SHALL display the video player with the lesson's MP4 video and text content.
2. WHEN a student completes viewing a lesson, THE LMS SHALL update the progress record for that lesson.
3. WHILE a student is enrolled in a course, THE LMS SHALL display their completion percentage based on lessons completed.
4. THE LMS SHALL support playback of locally-hosted MP4 video files using Video.js player.

### Requirement 4: Quiz Taking and Auto-Grading

**User Story:** As a student, I want to take quizzes and receive immediate feedback, so that I can assess my understanding of the material.

#### Acceptance Criteria

1. WHEN a student requests a quiz for a lesson, THE LMS SHALL return the quiz questions in multiple-choice format.
2. WHEN a student submits quiz answers, THE LMS SHALL automatically grade the submission and return the score within 1 second.
3. THE LMS SHALL store quiz results associated with the student and lesson for progress tracking.
4. IF a student submits incomplete quiz answers, THEN THE LMS SHALL return a validation error indicating missing responses.

### Requirement 5: AI Lesson Summaries

**User Story:** As a student, I want to generate AI summaries of lessons, so that I can quickly review key concepts.

#### Acceptance Criteria

1. WHEN a student requests an AI summary for a lesson, THE LMS SHALL generate a summary using GPT4All or template-based logic.
2. THE LMS SHALL cache generated summaries to avoid redundant AI processing for the same lesson.
3. IF the AI service is unavailable, THEN THE LMS SHALL return a fallback template-based summary or an informative error message.

### Requirement 6: Course Creation by Instructors

**User Story:** As an instructor, I want to create courses with lessons and quizzes, so that I can share my knowledge with students.

#### Acceptance Criteria

1. WHEN an instructor submits course creation data, THE LMS SHALL create a new course record with title, description, and instructor association.
2. WHEN an instructor adds a lesson to a course, THE LMS SHALL store the lesson with title, video reference, and text content.
3. WHEN an instructor creates a quiz for a lesson, THE LMS SHALL store up to 5 multiple-choice questions with correct answers.
4. WHILE a user has the Instructor role, THE LMS SHALL grant access to course creation and management features.
5. IF a non-instructor user attempts to create a course, THEN THE LMS SHALL deny the request with an authorization error.

### Requirement 7: AI Quiz Generation

**User Story:** As an instructor, I want to generate quiz questions using AI, so that I can quickly create assessments for my lessons.

#### Acceptance Criteria

1. WHEN an instructor requests AI-generated quiz questions for a lesson, THE LMS SHALL generate 5 multiple-choice questions based on lesson content.
2. THE LMS SHALL use GPT4All or template-based logic for quiz generation.
3. IF AI quiz generation fails, THEN THE LMS SHALL return template-based questions or an informative error message.

### Requirement 8: Security and Input Validation

**User Story:** As a system administrator, I want the LMS to be secure, so that user data and content are protected.

#### Acceptance Criteria

1. THE LMS SHALL hash all user passwords using bcrypt before storage.
2. THE LMS SHALL validate all API inputs using class-validator before processing.
3. THE LMS SHALL implement role-based access control for Student and Instructor features.
4. THE LMS SHALL use JWT tokens with appropriate expiration for authentication.
5. IF an unauthorized user attempts to access protected resources, THEN THE LMS SHALL return a 401 or 403 error response.
