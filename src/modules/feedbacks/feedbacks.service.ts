import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(Feedback)
    private feedbacksRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbacksRepository.create(createFeedbackDto);
    return this.feedbacksRepository.save(feedback);
  }

  async findAll(
    params: PaginationParams & { isRead?: boolean },
    includeDeleted: boolean = false,
  ): Promise<PaginatedResponse<Feedback>> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      isRead,
    } = params;
    
    const queryBuilder = this.feedbacksRepository.createQueryBuilder('feedback');
    
    if (includeDeleted) {
      queryBuilder.withDeleted();
    }
    
    if (isRead !== undefined) {
      queryBuilder.andWhere('feedback.isRead = :isRead', { isRead });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(feedback.name ILIKE :search OR feedback.email ILIKE :search OR feedback.subject ILIKE :search OR feedback.message ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    const totalItems = await queryBuilder.getCount();
    
    queryBuilder
      .orderBy(`feedback.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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

  async findOne(id: string, includeDeleted: boolean = false): Promise<Feedback> {
    const feedback = await this.feedbacksRepository.findOne({
      where: { id },
      withDeleted: includeDeleted,
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.findOne(id);
    
    Object.assign(feedback, updateFeedbackDto);
    return this.feedbacksRepository.save(feedback);
  }

  async markAsRead(id: string): Promise<Feedback> {
    const feedback = await this.findOne(id);
    
    feedback.isRead = true;
    return this.feedbacksRepository.save(feedback);
  }

  async remove(id: string): Promise<void> {
    const feedback = await this.findOne(id);
    await this.feedbacksRepository.softDelete(id);
  }

  async restore(id: string): Promise<Feedback> {
    const feedback = await this.findOne(id, true);
    
    if (!feedback.deletedAt) {
      throw new Error('Feedback is not deleted');
    }
    
    await this.feedbacksRepository.restore(id);
    return this.findOne(id);
  }
}
