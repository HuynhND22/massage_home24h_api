import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType } from './entities/category.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryTranslationDto } from './dto/category-translation.dto';
import { UpdateCategoryTranslationDto } from './dto/category-translation.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private categoryTranslationsRepository: Repository<CategoryTranslation>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { translations, ...categoryData } = createCategoryDto;
    const category = this.categoriesRepository.create(categoryData);
    
    if (translations) {
      category.translations = translations.map(translation => 
        this.categoryTranslationsRepository.create(translation)
      );
    }
    
    return this.categoriesRepository.save(category);
  }

  async findAll(
    params: PaginationParams & { type?: CategoryType },
    includeDeleted: boolean = false,
  ): Promise<PaginatedResponse<Category>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', type } = params;
    
    const queryBuilder = this.categoriesRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translations');
    
    if (includeDeleted) {
      queryBuilder.withDeleted();
    }
    
    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(translations.name ILIKE :search OR translations.description ILIKE :search)',
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
      relations: ['translations'],
      withDeleted: includeDeleted,
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { translations, ...categoryData } = updateCategoryDto;
    const category = await this.findOne(id);
    
    Object.assign(category, categoryData);
    
    if (translations) {
      // Remove existing translations
      await this.categoryTranslationsRepository.delete({ categoryId: id });
      
      // Create new translations
      category.translations = translations.map(translation => 
        this.categoryTranslationsRepository.create({
          ...translation,
          categoryId: id,
        })
      );
    }
    
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
