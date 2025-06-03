import { BlogsService } from './blogs.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogTranslationDto } from './dto/create-blog-translation.dto';
import { UpdateBlogTranslationDto } from './dto/update-blog-translation.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class BlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    create(req: any): Promise<any>;
    findAll(paginationDto: PaginationDto, categoryId?: string, includeDeleted?: boolean): Promise<import("../../common/interfaces/pagination.interface").PaginatedResponse<import("./entities/blog.entity").Blog>>;
    findBySlug(slug: string): Promise<import("./entities/blog.entity").Blog>;
    findOne(id: string, includeDeleted?: boolean): Promise<import("./entities/blog.entity").Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<import("./entities/blog.entity").Blog>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/blog.entity").Blog>;
    createTranslation(createTranslationDto: CreateBlogTranslationDto): Promise<import("./entities/blog-translation.entity").BlogTranslation>;
    findTranslation(id: string): Promise<import("./entities/blog-translation.entity").BlogTranslation>;
    updateTranslation(id: string, updateTranslationDto: UpdateBlogTranslationDto): Promise<import("./entities/blog-translation.entity").BlogTranslation>;
    removeTranslation(id: string): Promise<void>;
    restoreTranslation(id: string): Promise<import("./entities/blog-translation.entity").BlogTranslation>;
}
