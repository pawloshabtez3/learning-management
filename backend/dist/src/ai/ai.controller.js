"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const register_dto_1 = require("../auth/dto/register.dto");
let AiController = class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    getStatus() {
        return {
            available: this.aiService.isAiAvailable(),
            fallbackEnabled: true,
            message: this.aiService.isAiAvailable()
                ? 'AI service is available'
                : 'Using template-based fallback',
        };
    }
    async summarize(summarizeDto) {
        const result = await this.aiService.generateSummary(summarizeDto.lessonId);
        return {
            lessonId: summarizeDto.lessonId,
            ...result,
        };
    }
    async generateQuiz(generateQuizDto) {
        const result = await this.aiService.generateQuizQuestions(generateQuizDto.lessonId);
        return {
            lessonId: generateQuizDto.lessonId,
            ...result,
        };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('summarize'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SummarizeDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "summarize", null);
__decorate([
    (0, common_1.Post)('generate-quiz'),
    (0, roles_decorator_1.Roles)(register_dto_1.Role.INSTRUCTOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.GenerateQuizDto]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateQuiz", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map