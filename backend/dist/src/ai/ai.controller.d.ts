import { AiService } from './ai.service';
import { SummarizeDto, GenerateQuizDto } from './dto';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    getStatus(): {
        available: boolean;
        fallbackEnabled: boolean;
        message: string;
    };
    summarize(summarizeDto: SummarizeDto): Promise<{
        summary: string;
        cached: boolean;
        aiGenerated: boolean;
        lessonId: string;
    }>;
    generateQuiz(generateQuizDto: GenerateQuizDto): Promise<{
        questions: import("./templates/quiz.template").GeneratedQuestion[];
        aiGenerated: boolean;
        lessonId: string;
    }>;
}
