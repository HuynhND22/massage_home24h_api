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
exports.WebSettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const web_settings_service_1 = require("./web-settings.service");
const create_web_setting_dto_1 = require("./dto/create-web-setting.dto");
const update_web_setting_dto_1 = require("./dto/update-web-setting.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let WebSettingsController = class WebSettingsController {
    webSettingsService;
    constructor(webSettingsService) {
        this.webSettingsService = webSettingsService;
    }
    create(createWebSettingDto) {
        return this.webSettingsService.create(createWebSettingDto);
    }
    findOne(includeDeleted) {
        return this.webSettingsService.findOne(includeDeleted);
    }
    update(id, updateWebSettingDto) {
        return this.webSettingsService.update(id, updateWebSettingDto);
    }
    remove(id) {
        return this.webSettingsService.remove(id);
    }
    restore(id) {
        return this.webSettingsService.restore(id);
    }
};
exports.WebSettingsController = WebSettingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create web settings' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Web settings created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_web_setting_dto_1.CreateWebSettingDto]),
    __metadata("design:returntype", void 0)
], WebSettingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get web settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return web settings' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Web settings not found' }),
    __param(0, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", void 0)
], WebSettingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update web settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Web settings updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Web settings not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_web_setting_dto_1.UpdateWebSettingDto]),
    __metadata("design:returntype", void 0)
], WebSettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete web settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Web settings deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Web settings not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebSettingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Restore deleted web settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Web settings restored successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Web settings not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebSettingsController.prototype, "restore", null);
exports.WebSettingsController = WebSettingsController = __decorate([
    (0, swagger_1.ApiTags)('web-settings'),
    (0, common_1.Controller)('web-settings'),
    __metadata("design:paramtypes", [web_settings_service_1.WebSettingsService])
], WebSettingsController);
//# sourceMappingURL=web-settings.controller.js.map