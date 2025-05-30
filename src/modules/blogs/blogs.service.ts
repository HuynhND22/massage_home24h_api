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

    const blog = this.blogsRepository.create(createBlogDto);
    return this.blogsRepository.save(blog);
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

  async findOne(id: string, includeDeleted: boolean = false): Promise<Blog> {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: ['category', 'translations'],
      withDeleted: includeDeleted,
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
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
    const blog = await this.findOne(id);
    
    // Check if slug is being updated and already exists
    if (updateBlogDto.slug && updateBlogDto.slug !== blog.slug) {
      const existingBlog = await this.blogsRepository.findOne({
        where: { slug: updateBlogDto.slug },
        withDeleted: true,
      });

      if (existingBlog && existingBlog.id !== id) {
        throw new BadRequestException('Blog with this slug already exists');
      }
    }
    
    Object.assign(blog, updateBlogDto);
    return this.blogsRepository.save(blog);
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);
    await this.blogsRepository.softDelete(id);
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
