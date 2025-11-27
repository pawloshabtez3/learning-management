/**
 * Template-based quiz generation fallback
 * Used when GPT4All is unavailable
 */

import { extractKeyTerms } from './summary.template';

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

/**
 * Generate template-based quiz questions from lesson content
 */
export function generateTemplateQuiz(content: string, lessonTitle: string): GeneratedQuestion[] {
  const keyTerms = extractKeyTerms(content);
  const questions: GeneratedQuestion[] = [];

  // Generate comprehension questions based on key terms
  const questionTemplates = [
    {
      template: (term: string) => `What is the main concept related to "${term}" in this lesson?`,
      generateOptions: (term: string) => [
        `Understanding and applying ${term} effectively`,
        `Ignoring ${term} completely`,
        `${term} is not relevant to this topic`,
        `${term} should be avoided`,
      ],
      correctIndex: 0,
    },
    {
      template: (term: string) => `Which statement best describes "${term}"?`,
      generateOptions: (term: string) => [
        `${term} is a key concept covered in this lesson`,
        `${term} is unrelated to the lesson content`,
        `${term} is only mentioned briefly without importance`,
        `${term} contradicts the main lesson objectives`,
      ],
      correctIndex: 0,
    },
    {
      template: (term: string) => `Why is "${term}" important in this context?`,
      generateOptions: (term: string) => [
        `It helps understand the core concepts of the lesson`,
        `It is not important at all`,
        `It only applies to advanced users`,
        `It was mentioned by mistake`,
      ],
      correctIndex: 0,
    },
    {
      template: (_term: string, title: string) => `What is the primary focus of "${title}"?`,
      generateOptions: (_term: string, title: string) => [
        `Teaching the concepts and skills outlined in ${title}`,
        `Providing entertainment without educational value`,
        `Testing prior knowledge only`,
        `Reviewing unrelated topics`,
      ],
      correctIndex: 0,
    },
    {
      template: (term: string) => `How should you approach learning about "${term}"?`,
      generateOptions: (term: string) => [
        `Study the material carefully and practice applying ${term}`,
        `Skip this section entirely`,
        `Only memorize without understanding`,
        `Assume you already know everything about ${term}`,
      ],
      correctIndex: 0,
    },
  ];

  // Generate up to 5 questions
  const numQuestions = Math.min(5, keyTerms.length, questionTemplates.length);

  for (let i = 0; i < numQuestions; i++) {
    const term = keyTerms[i] || lessonTitle;
    const template = questionTemplates[i];

    questions.push({
      question: template.template(term, lessonTitle),
      options: template.generateOptions(term, lessonTitle),
      correctIndex: template.correctIndex,
    });
  }

  // If we don't have enough questions, add generic ones
  while (questions.length < 5) {
    const genericQuestions = [
      {
        question: `What should you do after completing this lesson?`,
        options: [
          'Review the key concepts and practice what you learned',
          'Immediately forget everything',
          'Skip to the next lesson without review',
          'Assume you have mastered everything',
        ],
        correctIndex: 0,
      },
      {
        question: `How can you best retain the information from this lesson?`,
        options: [
          'Take notes and review them regularly',
          'Never look at the material again',
          'Only read once quickly',
          'Avoid practicing the concepts',
        ],
        correctIndex: 0,
      },
    ];

    const genericQ = genericQuestions[questions.length - 3];
    if (genericQ) {
      questions.push(genericQ);
    } else {
      break;
    }
  }

  return questions.slice(0, 5);
}

/**
 * Parse AI-generated quiz response into structured format
 */
export function parseAiQuizResponse(response: string): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 5).map((q, index) => ({
        question: q.question || `Question ${index + 1}`,
        options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
      }));
    }
  } catch {
    // If JSON parsing fails, try to extract questions from text
    const questionBlocks = response.split(/\d+\.\s+/).filter((block) => block.trim());

    for (const block of questionBlocks.slice(0, 5)) {
      const lines = block.split('\n').filter((line) => line.trim());
      if (lines.length >= 2) {
        const question = lines[0].trim();
        const options = lines.slice(1, 5).map((line) =>
          line.replace(/^[a-d]\)\s*/i, '').trim()
        );

        questions.push({
          question,
          options: options.length >= 4 ? options : ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        });
      }
    }
  }

  return questions;
}
