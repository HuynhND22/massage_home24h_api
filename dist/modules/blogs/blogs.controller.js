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
exports.BlogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blogs_service_1 = require("./blogs.service");
const update_blog_dto_1 = require("./dto/update-blog.dto");
const create_blog_translation_dto_1 = require("./dto/create-blog-translation.dto");
const update_blog_translation_dto_1 = require("./dto/update-blog-translation.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const upload_middleware_1 = require("../../common/middlewares/upload-middleware");
let BlogsController = class BlogsController {
    blogsService;
    constructor(blogsService) {
        this.blogsService = blogsService;
    }
    create(req) {
        return new Promise((resolve, reject) => {
            (0, upload_middleware_1.uploadR2)(req, req.res, async (err) => {
                if (err) {
                    console.error('Upload middleware error:', err);
                    return reject(err);
                }
                try {
                    console.log('Form data received:', req.body);
                    const blogData = {};
                    blogData.title = req.body.title;
                    blogData.content = req.body.content;
                    blogData.excerpt = req.body.excerpt;
                    blogData.categoryId = req.body.categoryId;
                    blogData.slug = req.body.slug;
                    if (req.file && req.file.location) {
                        blogData.coverImage = req.file.location;
                    }
                    console.log('Blog data after processing:', blogData);
                    if (!blogData.title) {
                        return reject({
                            message: 'Title is required',
                            statusCode: 400
                        });
                    }
                    if (!blogData.categoryId) {
                        return reject({
                            message: 'Category ID is required',
                            statusCode: 400
                        });
                    }
                    const created = await this.blogsService.create(blogData);
                    console.log('Blog created successfully:', created);
                    resolve(created);
                }
                catch (error) {
                    console.error('Error creating blog:', error);
                    reject(error);
                }
            });
        });
    }
    findAll(paginationDto, categoryId, includeDeleted) {
        return this.blogsService.findAll({ ...paginationDto, categoryId }, includeDeleted);
    }
    findBySlug(slug) {
        return this.blogsService.findBySlug(slug);
    }
    findOne(id, includeDeleted) {
        return this.blogsService.findOne(id, includeDeleted);
    }
    update(id, updateBlogDto) {
        return this.blogsService.update(id, updateBlogDto);
    }
    remove(id) {
        return this.blogsService.remove(id);
    }
    restore(id) {
        return this.blogsService.restore(id);
    }
    createTranslation(createTranslationDto) {
        return this.blogsService.createTranslation(createTranslationDto);
    }
    findTranslation(id) {
        return this.blogsService.findTranslation(id);
    }
    updateTranslation(id, updateTranslationDto) {
        return this.blogsService.updateTranslation(id, updateTranslationDto);
    }
    removeTranslation(id) {
        return this.blogsService.removeTranslation(id);
    }
    restoreTranslation(id) {
        return this.blogsService.restoreTranslation(id);
    }
};
exports.BlogsController = BlogsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog with image upload' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Blog created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all blog posts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all blog posts' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto, String, Boolean]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a blog post by slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the blog post' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a blog post by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the blog post' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('includeDeleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a blog post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_dto_1.UpdateBlogDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a blog post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a deleted blog post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog post restored successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog post not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "restore", null);
__decorate([
    (0, common_1.Post)('translations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new blog translation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Blog translation created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_translation_dto_1.CreateBlogTranslationDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "createTranslation", null);
__decorate([
    (0, common_1.Get)('translations/:id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a blog translation by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the blog translation' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog translation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findTranslation", null);
__decorate([
    (0, common_1.Patch)('translations/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a blog translation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog translation updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog translation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_translation_dto_1.UpdateBlogTranslationDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "updateTranslation", null);
__decorate([
    (0, common_1.Delete)('translations/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a blog translation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog translation deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog translation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "removeTranslation", null);
__decorate([
    (0, common_1.Post)('translations/:id/restore'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Restore a deleted blog translation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Blog translation restored successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Blog translation not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "restoreTranslation", null);
exports.BlogsController = BlogsController = __decorate([
    (0, swagger_1.ApiTags)('blogs'),
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService])
], BlogsController);
//# sourceMappingURL=blogs.controller.js.map