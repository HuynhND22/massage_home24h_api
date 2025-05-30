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
exports.FeedbacksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feedback_entity_1 = require("./entities/feedback.entity");
let FeedbacksService = class FeedbacksService {
    feedbacksRepository;
    constructor(feedbacksRepository) {
        this.feedbacksRepository = feedbacksRepository;
    }
    async create(createFeedbackDto) {
        const feedback = this.feedbacksRepository.create(createFeedbackDto);
        return this.feedbacksRepository.save(feedback);
    }
    async findAll(params, includeDeleted = false) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', isRead, } = params;
        const queryBuilder = this.feedbacksRepository.createQueryBuilder('feedback');
        if (includeDeleted) {
            queryBuilder.withDeleted();
        }
        if (isRead !== undefined) {
            queryBuilder.andWhere('feedback.isRead = :isRead', { isRead });
        }
        if (search) {
            queryBuilder.andWhere('(feedback.name ILIKE :search OR feedback.email ILIKE :search OR feedback.subject ILIKE :search OR feedback.message ILIKE :search)', { search: `%${search}%` });
        }
        const totalItems = await queryBuilder.getCount();
        queryBuilder
            .orderBy(`feedback.${sortBy}`, sortOrder)
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
        const feedback = await this.feedbacksRepository.findOne({
            where: { id },
            withDeleted: includeDeleted,
        });
        if (!feedback) {
            throw new common_1.NotFoundException(`Feedback with ID ${id} not found`);
        }
        return feedback;
    }
    async update(id, updateFeedbackDto) {
        const feedback = await this.findOne(id);
        Object.assign(feedback, updateFeedbackDto);
        return this.feedbacksRepository.save(feedback);
    }
    async markAsRead(id) {
        const feedback = await this.findOne(id);
        feedback.isRead = true;
        return this.feedbacksRepository.save(feedback);
    }
    async remove(id) {
        const feedback = await this.findOne(id);
        await this.feedbacksRepository.softDelete(id);
    }
    async restore(id) {
        const feedback = await this.findOne(id, true);
        if (!feedback.deletedAt) {
            throw new Error('Feedback is not deleted');
        }
        await this.feedbacksRepository.restore(id);
        return this.findOne(id);
    }
};
exports.FeedbacksService = FeedbacksService;
exports.FeedbacksService = FeedbacksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeedbacksService);
//# sourceMappingURL=feedbacks.service.js.map