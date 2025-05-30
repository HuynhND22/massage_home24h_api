import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { BlogTranslation } from './entities/blog-translation.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogTranslationDto } from './dto/create-blog-translation.dto';
import { UpdateBlogTranslationDto } from './dto/update-blog-translation.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';
export declare class BlogsService {
    private blogsRepository;
    private blogTranslationsRepository;
    constructor(blogsRepository: Repository<Blog>, blogTranslationsRepository: Repository<BlogTranslation>);
    create(createBlogDto: CreateBlogDto): Promise<Blog>;
    findAll(params: PaginationParams & {
        categoryId?: string;
    }, includeDeleted?: boolean): Promise<PaginatedResponse<Blog>>;
    findOne(id: string, includeDeleted?: boolean): Promise<Blog>;
    findBySlug(slug: string): Promise<Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<Blog>;
    createTranslation(createTranslationDto: CreateBlogTranslationDto): Promise<BlogTranslation>;
    findTranslation(id: string): Promise<BlogTranslation>;
    updateTranslation(id: string, updateTranslationDto: UpdateBlogTranslationDto): Promise<BlogTranslation>;
    removeTranslation(id: string): Promise<void>;
    restoreTranslation(id: string): Promise<BlogTranslation>;
}
