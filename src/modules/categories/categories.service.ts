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
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private categoryTranslationsRepository: Repository<CategoryTranslation>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { translations, name, description, ...categoryData } = createCategoryDto;
    
    return this.categoriesRepository.manager.transaction(async transactionalEntityManager => {
      // Create and save the category
      const category = this.categoriesRepository.create(categoryData);
      const savedCategory = await transactionalEntityManager.save(Category, category);
      
      if (translations && translations.length > 0) {
        // Create and save translations
        const categoryTranslations = translations.map(translation => 
          this.categoryTranslationsRepository.create({
            ...translation,
            categoryId: savedCategory.id
          })
        );
        
        await transactionalEntityManager.save(CategoryTranslation, categoryTranslations);
        savedCategory.translations = categoryTranslations;
      }
      
      return savedCategory;
    });
  }

  async findAll(
    paginationDto: PaginationDto,
    includeDeleted = false,
  ): Promise<{ data: Category[]; total: number }> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    if (includeDeleted) {
      const [data, total] = await this.categoriesRepository.findAndCount({
        relations: ['translations'],
        withDeleted: true,
        skip: (page - 1) * limit,
        take: limit,
      });
      return { data, total };
    }

    const [data, total] = await this.categoriesRepository.findAndCount({
      relations: ['translations'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findOne(id: string, includeDeleted = false): Promise<Category> {
    const options = {
      where: { id },
      relations: ['translations'],
      withDeleted: includeDeleted,
    };

    const category = await this.categoriesRepository.findOne(options);

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
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

  async remove(id: string): Promise<Category> {
    try {
      // Tìm category kể cả đã bị soft delete
      const category = await this.findOne(id, true);
      console.log('Found category:', category);
      
      await this.categoriesRepository.manager.transaction(async transactionalEntityManager => {
        try {
          // Soft delete translations first
          console.log('Soft deleting translations for category:', id);
          const translationResult = await transactionalEntityManager
            .getRepository(CategoryTranslation)
            .softDelete({ categoryId: id });
          console.log('Translation delete result:', translationResult);
          
          // Then soft delete the category
          console.log('Soft deleting category:', id);
          const categoryResult = await transactionalEntityManager
            .getRepository(Category)
            .softDelete(id);
          console.log('Category delete result:', categoryResult);
        } catch (transactionError) {
          console.error('Error in transaction:', transactionError);
          throw transactionError;
        }
      });

      return category;
    } catch (error) {
      console.error('Error in remove method:', error);
      throw error;
    }
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
