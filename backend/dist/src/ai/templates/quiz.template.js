"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemplateQuiz = generateTemplateQuiz;
exports.parseAiQuizResponse = parseAiQuizResponse;
const summary_template_1 = require("./summary.template");
function generateTemplateQuiz(content, lessonTitle) {
    const keyTerms = (0, summary_template_1.extractKeyTerms)(content);
    const questions = [];
    const questionTemplates = [
        {
            template: (term) => `What is the main concept related to "${term}" in this lesson?`,
            generateOptions: (term) => [
                `Understanding and applying ${term} effectively`,
                `Ignoring ${term} completely`,
                `${term} is not relevant to this topic`,
                `${term} should be avoided`,
            ],
            correctIndex: 0,
        },
        {
            template: (term) => `Which statement best describes "${term}"?`,
            generateOptions: (term) => [
                `${term} is a key concept covered in this lesson`,
                `${term} is unrelated to the lesson content`,
                `${term} is only mentioned briefly without importance`,
                `${term} contradicts the main lesson objectives`,
            ],
            correctIndex: 0,
        },
        {
            template: (term) => `Why is "${term}" important in this context?`,
            generateOptions: (term) => [
                `It helps understand the core concepts of the lesson`,
                `It is not important at all`,
                `It only applies to advanced users`,
                `It was mentioned by mistake`,
            ],
            correctIndex: 0,
        },
        {
            template: (_term, title) => `What is the primary focus of "${title}"?`,
            generateOptions: (_term, title) => [
                `Teaching the concepts and skills outlined in ${title}`,
                `Providing entertainment without educational value`,
                `Testing prior knowledge only`,
                `Reviewing unrelated topics`,
            ],
            correctIndex: 0,
        },
        {
            template: (term) => `How should you approach learning about "${term}"?`,
            generateOptions: (term) => [
                `Study the material carefully and practice applying ${term}`,
                `Skip this section entirely`,
                `Only memorize without understanding`,
                `Assume you already know everything about ${term}`,
            ],
            correctIndex: 0,
        },
    ];
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
        }
        else {
            break;
        }
    }
    return questions.slice(0, 5);
}
function parseAiQuizResponse(response) {
    const questions = [];
    try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed)) {
            return parsed.slice(0, 5).map((q, index) => ({
                question: q.question || `Question ${index + 1}`,
                options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
                correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
            }));
        }
    }
    catch {
        const questionBlocks = response.split(/\d+\.\s+/).filter((block) => block.trim());
        for (const block of questionBlocks.slice(0, 5)) {
            const lines = block.split('\n').filter((line) => line.trim());
            if (lines.length >= 2) {
                const question = lines[0].trim();
                const options = lines.slice(1, 5).map((line) => line.replace(/^[a-d]\)\s*/i, '').trim());
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
//# sourceMappingURL=quiz.template.js.map