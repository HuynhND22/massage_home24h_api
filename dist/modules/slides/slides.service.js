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
exports.SlidesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const slide_entity_1 = require("./entities/slide.entity");
let SlidesService = class SlidesService {
    slidesRepository;
    constructor(slidesRepository) {
        this.slidesRepository = slidesRepository;
    }
    async create(createSlideDto) {
        const slide = this.slidesRepository.create(createSlideDto);
        return this.slidesRepository.save(slide);
    }
    async findAll(params, includeDeleted = false) {
        const { page = 1, limit = 10, search, sortBy = 'order', sortOrder = 'ASC', role, } = params;
        const queryBuilder = this.slidesRepository.createQueryBuilder('slide');
        if (includeDeleted) {
            queryBuilder.withDeleted();
        }
        if (role) {
            queryBuilder.andWhere('slide.role = :role', { role });
        }
        if (search) {
            queryBuilder.andWhere('(slide.title ILIKE :search OR slide.description ILIKE :search)', { search: `%${search}%` });
        }
        const totalItems = await queryBuilder.getCount();
        queryBuilder
            .orderBy(`slide.${sortBy}`, sortOrder)
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
        const slide = await this.slidesRepository.findOne({
            where: { id },
            withDeleted: includeDeleted,
        });
        if (!slide) {
            throw new common_1.NotFoundException(`Slide with ID ${id} not found`);
        }
        return slide;
    }
    async update(id, updateSlideDto) {
        const slide = await this.findOne(id);
        Object.assign(slide, updateSlideDto);
        return this.slidesRepository.save(slide);
    }
    async remove(id) {
        const slide = await this.findOne(id);
        await this.slidesRepository.softDelete(id);
    }
    async restore(id) {
        const slide = await this.findOne(id, true);
        if (!slide.deletedAt) {
            throw new Error('Slide is not deleted');
        }
        await this.slidesRepository.restore(id);
        return this.findOne(id);
    }
};
exports.SlidesService = SlidesService;
exports.SlidesService = SlidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(slide_entity_1.Slide)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SlidesService);
//# sourceMappingURL=slides.service.js.map