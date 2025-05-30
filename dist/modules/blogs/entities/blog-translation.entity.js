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
exports.BlogTranslation = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../common/entities/base.entity");
const blog_entity_1 = require("./blog.entity");
let BlogTranslation = class BlogTranslation extends base_entity_1.BaseEntity {
    blogId;
    language;
    title;
    description;
    content;
    blog;
};
exports.BlogTranslation = BlogTranslation;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlogTranslation.prototype, "blogId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlogTranslation.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BlogTranslation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BlogTranslation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], BlogTranslation.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => blog_entity_1.Blog, (blog) => blog.translations, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'blogId' }),
    __metadata("design:type", blog_entity_1.Blog)
], BlogTranslation.prototype, "blog", void 0);
exports.BlogTranslation = BlogTranslation = __decorate([
    (0, typeorm_1.Entity)('blog_translations')
], BlogTranslation);
//# sourceMappingURL=blog-translation.entity.js.map