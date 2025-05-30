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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_entity_1 = require("./entities/service.entity");
let ServicesService = class ServicesService {
    servicesRepository;
    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }
    async create(createServiceDto) {
        const service = this.servicesRepository.create(createServiceDto);
        return this.servicesRepository.save(service);
    }
    async findAll(params, includeDeleted = false) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', categoryId, } = params;
        const queryBuilder = this.servicesRepository.createQueryBuilder('service')
            .leftJoinAndSelect('service.category', 'category');
        if (includeDeleted) {
            queryBuilder.withDeleted();
        }
        if (categoryId) {
            queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId });
        }
        if (search) {
            queryBuilder.andWhere('(service.name ILIKE :search OR service.description ILIKE :search)', { search: `%${search}%` });
        }
        const totalItems = await queryBuilder.getCount();
        queryBuilder
            .orderBy(`service.${sortBy}`, sortOrder)
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
        const service = await this.servicesRepository.findOne({
            where: { id },
            relations: ['category'],
            withDeleted: includeDeleted,
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }
    async update(id, updateServiceDto) {
        const service = await this.findOne(id);
        Object.assign(service, updateServiceDto);
        return this.servicesRepository.save(service);
    }
    async remove(id) {
        const service = await this.findOne(id);
        await this.servicesRepository.softDelete(id);
    }
    async restore(id) {
        const service = await this.findOne(id, true);
        if (!service.deletedAt) {
            throw new Error('Service is not deleted');
        }
        await this.servicesRepository.restore(id);
        return this.findOne(id);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServicesService);
//# sourceMappingURL=services.service.js.map