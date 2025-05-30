"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbacksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const feedbacks_service_1 = require("./feedbacks.service");
const feedbacks_controller_1 = require("./feedbacks.controller");
const feedback_entity_1 = require("./entities/feedback.entity");
let FeedbacksModule = class FeedbacksModule {
};
exports.FeedbacksModule = FeedbacksModule;
exports.FeedbacksModule = FeedbacksModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([feedback_entity_1.Feedback])],
        controllers: [feedbacks_controller_1.FeedbacksController],
        providers: [feedbacks_service_1.FeedbacksService],
        exports: [feedbacks_service_1.FeedbacksService],
    })
], FeedbacksModule);
//# sourceMappingURL=feedbacks.module.js.map