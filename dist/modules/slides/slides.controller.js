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
exports.SlidesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const slides_service_1 = require("./slides.service");
const create_slide_dto_1 = require("./dto/create-slide.dto");
const update_slide_dto_1 = require("./dto/update-slide.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const slide_entity_1 = require("./entities/slide.entity");
let SlidesController = class SlidesController {
    slidesService;
    constructor(slidesService) {
        this.slidesService = slidesService;
    }
    create(createSlideDto) {
        return this.slidesService.create(createSlideDto);
    }
    findAll(paginationDto, role, includeDeleted) {
        return this.slidesService.findAll({ ...paginationDto, role }, includeDeleted);
    }
    findOne(id, includeDeleted) {
        return this.slidesService.findOne(id, includeDeleted);
    }
    update(id, updateSlideDto) {
        return this.slidesService.update(id, updateSlideDto);
    }
    remove(id) {
        return this.slidesService.remove(id);
    }
    restore(id) {
        return this.slidesService.restore(id);
    }
};
exports.SlidesController = SlidesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new slide' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Slide created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_slide_dto_1.CreateSlideDto]),
    __metadata("design:returntype", void 0)
], SlidesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all slides' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all slides' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, Boolean]),
    __metadata("design:returntype", void 0)
], SlidesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a slide by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the slide' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Slide not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], SlidesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a slide' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Slide updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Slide not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_slide_dto_1.UpdateSlideDto]),
    __metadata("design:returntype", void 0)
], SlidesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a slide' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Slide deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Slide not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlidesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a deleted slide' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Slide restored successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Slide not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SlidesController.prototype, "restore", null);
exports.SlidesController = SlidesController = __decorate([
    (0, swagger_1.ApiTags)('slides'),
    (0, common_1.Controller)('slides'),
    __metadata("design:paramtypes", [slides_service_1.SlidesService])
], SlidesController);
//# sourceMappingURL=slides.controller.js.map