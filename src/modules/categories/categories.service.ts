import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
import { Service } from '../services/entities/service.entity';
import { ServiceTranslation } from '../services/entities/service-translation.entity';
import { ServiceDetail } from '../services/entities/service-detail.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { BlogTranslation } from '../blogs/entities/blog-translation.entity';
import { Language } from '../../common/dto/base-translation.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private categoryTranslationsRepository: Repository<CategoryTranslation>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(ServiceTranslation)
    private serviceTranslationsRepository: Repository<ServiceTranslation>,
    @InjectRepository(ServiceDetail)
    private serviceDetailsRepository: Repository<ServiceDetail>,
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
    @InjectRepository(BlogTranslation)
    private blogTranslationsRepository: Repository<BlogTranslation>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { translations, name, description, ...categoryData } = createCategoryDto;
    
    // Validate that all required languages are present
    const requiredLanguages = [Language.EN, Language.VI, Language.KO, Language.ZH];
    const providedLanguages = translations.map(t => t.language);
    const missingLanguages = requiredLanguages.filter(lang => !providedLanguages.includes(lang));
    
    if (missingLanguages.length > 0) {
      throw new BadRequestException(`Missing translations for languages: ${missingLanguages.join(', ')}`);
    }
    
    return this.categoriesRepository.manager.transaction(async transactionalEntityManager => {
      // Create and save the category
      const category = this.categoriesRepository.create(categoryData);
      const savedCategory = await transactionalEntityManager.save(Category, category);
      
        // Create and save translations
        const categoryTranslations = translations.map(translation => 
          this.categoryTranslationsRepository.create({
            ...translation,
            categoryId: savedCategory.id
          })
        );
        
        await transactionalEntityManager.save(CategoryTranslation, categoryTranslations);
        savedCategory.translations = categoryTranslations;
      
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
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['translations'],
      withDeleted: includeDeleted,
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { translations, ...categoryData } = updateCategoryDto;
    
    return this.categoriesRepository.manager.transaction(async transactionalEntityManager => {
      // Get the category with its current translations
      const category = await this.findOne(id);
      
      // Update basic category data
      Object.assign(category, categoryData);
      await transactionalEntityManager.save(Category, category);
      
      if (translations && translations.length > 0) {
        // Update or create translations
        for (const translation of translations) {
          // Use queryBuilder to ensure we get the latest data
          const existingTranslation = await transactionalEntityManager
            .getRepository(CategoryTranslation)
            .createQueryBuilder('translation')
            .where('translation.categoryId = :categoryId', { categoryId: id })
            .andWhere('translation.language = :language', { language: translation.language })
            .getOne();
          
          if (existingTranslation) {
            // Update existing translation
            await transactionalEntityManager
              .getRepository(CategoryTranslation)
              .createQueryBuilder()
              .update()
              .set({
                name: translation.name,
                description: translation.description || existingTranslation.description
              })
              .where('id = :id', { id: existingTranslation.id })
              .execute();
          } else {
            // Create new translation
            await transactionalEntityManager
              .getRepository(CategoryTranslation)
              .createQueryBuilder()
              .insert()
              .values({
                categoryId: id,
                language: translation.language,
                name: translation.name,
                description: translation.description || ''
              })
              .execute();
          }
        }
      }
      
      // Fetch and return the updated category with all translations
      const updatedCategory = await transactionalEntityManager
        .getRepository(Category)
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.translations', 'translations')
        .where('category.id = :id', { id })
        .getOne();

      if (!updatedCategory) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }

      return updatedCategory;
    });
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
          
          // Soft delete services and their related data
          console.log('Soft deleting services for category:', id);
          const services = await transactionalEntityManager
            .getRepository(Service)
            .find({ where: { categoryId: id } });

          for (const service of services) {
            // Soft delete service translations
            await transactionalEntityManager
              .getRepository(ServiceTranslation)
              .softDelete({ serviceId: service.id });

            // Soft delete service details
            await transactionalEntityManager
              .getRepository(ServiceDetail)
              .softDelete({ serviceId: service.id });

            // Soft delete service
            await transactionalEntityManager
              .getRepository(Service)
              .softDelete(service.id);
          }

          // Soft delete blogs and their translations
          console.log('Soft deleting blogs for category:', id);
          const blogs = await transactionalEntityManager
            .getRepository(Blog)
            .find({ where: { categoryId: id } });

          for (const blog of blogs) {
            // Soft delete blog translations
            await transactionalEntityManager
              .getRepository(BlogTranslation)
              .softDelete({ blogId: blog.id });

            // Soft delete blog
            await transactionalEntityManager
              .getRepository(Blog)
              .softDelete(blog.id);
          }
          
          // Finally soft delete the category
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
      throw new BadRequestException('Category is not deleted');
    }
    
    await this.categoriesRepository.restore(id);
    return this.findOne(id);
  }
}
