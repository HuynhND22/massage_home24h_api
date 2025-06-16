import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { BlogTranslation } from './entities/blog-translation.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogTranslationDto } from './dto/create-blog-translation.dto';
import { UpdateBlogTranslationDto } from './dto/update-blog-translation.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { Language } from '../../common/dto/base-translation.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
    @InjectRepository(BlogTranslation)
    private blogTranslationsRepository: Repository<BlogTranslation>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    // Check if slug already exists
    const existingBlog = await this.blogsRepository.findOne({
      where: { slug: createBlogDto.slug },
      withDeleted: true,
    });

    if (existingBlog) {
      throw new BadRequestException('Blog with this slug already exists');
    }

    // Validate that all required languages are present
    const requiredLanguages = [Language.EN, Language.VI, Language.KO, Language.ZH];
    const providedLanguages = createBlogDto.translations.map(t => t.language);
    const missingLanguages = requiredLanguages.filter(lang => !providedLanguages.includes(lang));
    
    if (missingLanguages.length > 0) {
      throw new BadRequestException(`Missing translations for languages: ${missingLanguages.join(', ')}`);
    }

    return this.blogsRepository.manager.transaction(async transactionalEntityManager => {
      // Create and save the blog
      const blog = this.blogsRepository.create(createBlogDto);
      const savedBlog = await transactionalEntityManager.save(Blog, blog);

      // Create and save translations
      const blogTranslations = createBlogDto.translations.map(translation => 
        this.blogTranslationsRepository.create({
          ...translation,
          blogId: savedBlog.id
        })
      );
      
      await transactionalEntityManager.save(BlogTranslation, blogTranslations);
      savedBlog.translations = blogTranslations;

      return savedBlog;
    });
  }

  async findAll(
    params: PaginationParams & { categoryId?: string },
    includeDeleted: boolean = false,
  ): Promise<PaginatedResponse<Blog>> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      categoryId,
    } = params;
    
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
      queryBuilder.andWhere(
        '(blog.title ILIKE :search OR blog.description ILIKE :search OR blog.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    const totalItems = await queryBuilder.getCount();
    
    queryBuilder
      .orderBy(`blog.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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

  async findOne(id: string, includeDeleted = false): Promise<Blog> {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['translations'],
      withDeleted: includeDeleted,
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }

    return blog;
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogsRepository.findOne({
      where: { slug },
      relations: ['category', 'translations'],
    });

    if (!blog) {
      throw new NotFoundException(`Blog with slug ${slug} not found`);
    }

    // Increment view count
    blog.viewCount += 1;
    await this.blogsRepository.save(blog);

    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const { translations, ...blogData } = updateBlogDto;
    
    return this.blogsRepository.manager.transaction(async transactionalEntityManager => {
      // Get the blog with its current translations
      const blog = await this.findOne(id);
      
      // Update basic blog data
      Object.assign(blog, blogData);
      await transactionalEntityManager.save(Blog, blog);
      
      if (translations && translations.length > 0) {
        // Update or create translations
        for (const translation of translations) {
          // Use queryBuilder to ensure we get the latest data
          const existingTranslation = await transactionalEntityManager
            .getRepository(BlogTranslation)
            .createQueryBuilder('translation')
            .where('translation.blogId = :blogId', { blogId: id })
            .andWhere('translation.language = :language', { language: translation.language })
            .getOne();
          
          if (existingTranslation) {
            // Update existing translation
            await transactionalEntityManager
              .getRepository(BlogTranslation)
              .createQueryBuilder()
              .update()
              .set({
                title: translation.title,
                description: translation.description || existingTranslation.description,
                content: translation.content || existingTranslation.content
              })
              .where('id = :id', { id: existingTranslation.id })
              .execute();
          } else {
            // Create new translation
            await transactionalEntityManager
              .getRepository(BlogTranslation)
              .createQueryBuilder()
              .insert()
              .values({
                blogId: id,
                language: translation.language,
                title: translation.title,
                description: translation.description || '',
                content: translation.content || ''
              })
              .execute();
          }
        }
      }
      
      // Fetch and return the updated blog with all translations
      const updatedBlog = await transactionalEntityManager
        .getRepository(Blog)
        .createQueryBuilder('blog')
        .leftJoinAndSelect('blog.translations', 'translations')
        .where('blog.id = :id', { id })
        .getOne();

      if (!updatedBlog) {
        throw new NotFoundException(`Blog with ID "${id}" not found`);
      }

      return updatedBlog;
    });
  }

  async remove(id: string): Promise<void> {
    try {
      // Tìm blog kể cả đã bị soft delete
      const blog = await this.findOne(id, true);
      console.log('Found blog:', blog);
      
      await this.blogsRepository.manager.transaction(async transactionalEntityManager => {
        try {
          // Soft delete translations first
          console.log('Soft deleting translations for blog:', id);
          const translationResult = await transactionalEntityManager
            .getRepository(BlogTranslation)
            .softDelete({ blogId: id });
          console.log('Translation delete result:', translationResult);
          
          // Then soft delete the blog
          console.log('Soft deleting blog:', id);
          const blogResult = await transactionalEntityManager
            .getRepository(Blog)
            .softDelete(id);
          console.log('Blog delete result:', blogResult);
        } catch (transactionError) {
          console.error('Error in transaction:', transactionError);
          throw transactionError;
        }
      });
    } catch (error) {
      console.error('Error in remove method:', error);
      throw error;
    }
  }

  async restore(id: string): Promise<Blog> {
    const blog = await this.findOne(id, true);
    
    if (!blog.deletedAt) {
      throw new BadRequestException('Blog is not deleted');
    }
    
    await this.blogsRepository.restore(id);
    return this.findOne(id);
  }

  // Blog Translation methods
  async createTranslation(createTranslationDto: CreateBlogTranslationDto): Promise<BlogTranslation> {
    // Check if blog exists
    const blog = await this.findOne(createTranslationDto.blogId);
    
    // Check if translation for this language already exists
    const existingTranslation = await this.blogTranslationsRepository.findOne({
      where: {
        blogId: createTranslationDto.blogId,
        language: createTranslationDto.language,
      },
      withDeleted: true,
    });

    if (existingTranslation) {
      throw new BadRequestException(`Translation for language ${createTranslationDto.language} already exists`);
    }

    const translation = this.blogTranslationsRepository.create(createTranslationDto);
    return this.blogTranslationsRepository.save(translation);
  }

  async findTranslation(id: string): Promise<BlogTranslation> {
    const translation = await this.blogTranslationsRepository.findOne({
      where: { id },
      relations: ['blog'],
    });

    if (!translation) {
      throw new NotFoundException(`Blog translation with ID ${id} not found`);
    }

    return translation;
  }

  async updateTranslation(
    id: string,
    updateTranslationDto: UpdateBlogTranslationDto,
  ): Promise<BlogTranslation> {
    const translation = await this.findTranslation(id);
    
    Object.assign(translation, updateTranslationDto);
    return this.blogTranslationsRepository.save(translation);
  }

  async removeTranslation(id: string): Promise<void> {
    const translation = await this.findTranslation(id);
    await this.blogTranslationsRepository.softDelete(id);
  }

  async restoreTranslation(id: string): Promise<BlogTranslation> {
    const translation = await this.blogTranslationsRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!translation) {
      throw new NotFoundException(`Blog translation with ID ${id} not found`);
    }

    if (!translation.deletedAt) {
      throw new BadRequestException('Blog translation is not deleted');
    }
    
    await this.blogTranslationsRepository.restore(id);
    return this.findTranslation(id);
  }
}
