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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProgressDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateProgressDto {
    lessonId;
    completed;
}
exports.UpdateProgressDto = UpdateProgressDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Lesson ID is required' }),
    (0, class_validator_1.IsUUID)('4', { message: 'Lesson ID must be a valid UUID' }),
    __metadata("design:type", String)
], UpdateProgressDto.prototype, "lessonId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'Completed must be a boolean value' }),
    __metadata("design:type", Boolean)
], UpdateProgressDto.prototype, "completed", void 0);
//# sourceMappingURL=update-progress.dto.js.map