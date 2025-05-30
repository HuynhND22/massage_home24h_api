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
exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_entity_1 = require("./entities/blog.entity");
const blog_translation_entity_1 = require("./entities/blog-translation.entity");
let BlogsService = class BlogsService {
    blogsRepository;
    blogTranslationsRepository;
    constructor(blogsRepository, blogTranslationsRepository) {
        this.blogsRepository = blogsRepository;
        this.blogTranslationsRepository = blogTranslationsRepository;
    }
    async create(createBlogDto) {
        const existingBlog = await this.blogsRepository.findOne({
            where: { slug: createBlogDto.slug },
            withDeleted: true,
        });
        if (existingBlog) {
            throw new common_1.BadRequestException('Blog with this slug already exists');
        }
        const blog = this.blogsRepository.create(createBlogDto);
        return this.blogsRepository.save(blog);
    }
    async findAll(params, includeDeleted = false) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', categoryId, } = params;
        const queryBuilder = this.blogsRepository.createQueryBuilder('blog')
            .leftJoinAndSelect('blog.category', 'category')
            .leftJoinAndSelect('blog.translations', 'translations');
        if (includeDeleted) {
            queryBuilder.withDeleted();
        }
        if (categoryId) {
            queryBuilder.andWhere('blog.categoryId = :categoryId', { categoryId });
        }
        if (search) {
            queryBuilder.andWhere('(blog.title ILIKE :search OR blog.description ILIKE :search OR blog.content ILIKE :search)', { search: `%${search}%` });
        }
        const totalItems = await queryBuilder.getCount();
        queryBuilder
            .orderBy(`blog.${sortBy}`, sortOrder)
            .skip((page - 1) * limit)
            .take(limit);
        const items = await queryBuilder.getMany();
        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }
    async findOne(id, includeDeleted = false) {
        const blog = await this.blogsRepository.findOne({
            where: { id },
            relations: ['category', 'translations'],
            withDeleted: includeDeleted,
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with ID ${id} not found`);
        }
        return blog;
    }
    async findBySlug(slug) {
        const blog = await this.blogsRepository.findOne({
            where: { slug },
            relations: ['category', 'translations'],
        });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with slug ${slug} not found`);
        }
        blog.viewCount += 1;
        await this.blogsRepository.save(blog);
        return blog;
    }
    async update(id, updateBlogDto) {
        const blog = await this.findOne(id);
        if (updateBlogDto.slug && updateBlogDto.slug !== blog.slug) {
            const existingBlog = await this.blogsRepository.findOne({
                where: { slug: updateBlogDto.slug },
                withDeleted: true,
            });
            if (existingBlog && existingBlog.id !== id) {
                throw new common_1.BadRequestException('Blog with this slug already exists');
            }
        }
        Object.assign(blog, updateBlogDto);
        return this.blogsRepository.save(blog);
    }
    async remove(id) {
        const blog = await this.findOne(id);
        await this.blogsRepository.softDelete(id);
    }
    async restore(id) {
        const blog = await this.findOne(id, true);
        if (!blog.deletedAt) {
            throw new common_1.BadRequestException('Blog is not deleted');
        }
        await this.blogsRepository.restore(id);
        return this.findOne(id);
    }
    async createTranslation(createTranslationDto) {
        const blog = await this.findOne(createTranslationDto.blogId);
        const existingTranslation = await this.blogTranslationsRepository.findOne({
            where: {
                blogId: createTranslationDto.blogId,
                language: createTranslationDto.language,
            },
            withDeleted: true,
        });
        if (existingTranslation) {
            throw new common_1.BadRequestException(`Translation for language ${createTranslationDto.language} already exists`);
        }
        const translation = this.blogTranslationsRepository.create(createTranslationDto);
        return this.blogTranslationsRepository.save(translation);
    }
    async findTranslation(id) {
        const translation = await this.blogTranslationsRepository.findOne({
            where: { id },
            relations: ['blog'],
        });
        if (!translation) {
            throw new common_1.NotFoundException(`Blog translation with ID ${id} not found`);
        }
        return translation;
    }
    async updateTranslation(id, updateTranslationDto) {
        const translation = await this.findTranslation(id);
        Object.assign(translation, updateTranslationDto);
        return this.blogTranslationsRepository.save(translation);
    }
    async removeTranslation(id) {
        const translation = await this.findTranslation(id);
        await this.blogTranslationsRepository.softDelete(id);
    }
    async restoreTranslation(id) {
        const translation = await this.blogTranslationsRepository.findOne({
            where: { id },
            withDeleted: true,
        });
        if (!translation) {
            throw new common_1.NotFoundException(`Blog translation with ID ${id} not found`);
        }
        if (!translation.deletedAt) {
            throw new common_1.BadRequestException('Blog translation is not deleted');
        }
        await this.blogTranslationsRepository.restore(id);
        return this.findTranslation(id);
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __param(1, (0, typeorm_1.InjectRepository)(blog_translation_entity_1.BlogTranslation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BlogsService);
//# sourceMappingURL=blogs.service.js.map