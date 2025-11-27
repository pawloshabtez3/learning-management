export interface GeneratedQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}
export declare function generateTemplateQuiz(content: string, lessonTitle: string): GeneratedQuestion[];
export declare function parseAiQuizResponse(response: string): GeneratedQuestion[];
