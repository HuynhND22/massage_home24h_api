import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(
    params: PaginationParams & { type?: CategoryType },
    includeDeleted: boolean = false,
  ): Promise<PaginatedResponse<Category>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', type } = params;
    
    const queryBuilder = this.categoriesRepository.createQueryBuilder('category');
    
    if (includeDeleted) {
      queryBuilder.withDeleted();
    }
    
    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    const totalItems = await queryBuilder.getCount();
    
    queryBuilder
      .orderBy(`category.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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

  async findOne(id: string, includeDeleted: boolean = false): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      withDeleted: includeDeleted,
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.softDelete(id);
  }

  async restore(id: string): Promise<Category> {
    const category = await this.findOne(id, true);
    
    if (!category.deletedAt) {
      throw new Error('Category is not deleted');
    }
    
    await this.categoriesRepository.restore(id);
    return this.findOne(id);
  }
}
