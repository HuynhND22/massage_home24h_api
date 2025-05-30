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
exports.FeedbacksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const feedbacks_service_1 = require("./feedbacks.service");
const create_feedback_dto_1 = require("./dto/create-feedback.dto");
const update_feedback_dto_1 = require("./dto/update-feedback.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let FeedbacksController = class FeedbacksController {
    feedbacksService;
    constructor(feedbacksService) {
        this.feedbacksService = feedbacksService;
    }
    create(createFeedbackDto) {
        return this.feedbacksService.create(createFeedbackDto);
    }
    findAll(paginationDto, isRead, includeDeleted) {
        return this.feedbacksService.findAll({ ...paginationDto, isRead }, includeDeleted);
    }
    findOne(id, includeDeleted) {
        return this.feedbacksService.findOne(id, includeDeleted);
    }
    update(id, updateFeedbackDto) {
        return this.feedbacksService.update(id, updateFeedbackDto);
    }
    markAsRead(id) {
        return this.feedbacksService.markAsRead(id);
    }
    remove(id) {
        return this.feedbacksService.remove(id);
    }
    restore(id) {
        return this.feedbacksService.restore(id);
    }
};
exports.FeedbacksController = FeedbacksController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new feedback' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_feedback_dto_1.CreateFeedbackDto]),
    __metadata("design:returntype", void 0)
], FeedbacksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all feedbacks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all feedbacks' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('isRead')),
    __param(2, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, Boolean, Boolean]),
    __metadata("design:returntype", void 0)
], FeedbacksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get a feedback by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the feedback' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], FeedbacksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_feedback_dto_1.UpdateFeedbackDto]),
    __metadata("design:returntype", void 0)
], FeedbacksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a feedback as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback marked as read successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbacksController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbacksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a deleted feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback restored successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbacksController.prototype, "restore", null);
exports.FeedbacksController = FeedbacksController = __decorate([
    (0, swagger_1.ApiTags)('feedbacks'),
    (0, common_1.Controller)('feedbacks'),
    __metadata("design:paramtypes", [feedbacks_service_1.FeedbacksService])
], FeedbacksController);
//# sourceMappingURL=feedbacks.controller.js.map