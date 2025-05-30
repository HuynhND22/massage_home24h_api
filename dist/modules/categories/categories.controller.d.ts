import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryType } from './entities/category.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").Category>;
    findAll(paginationDto: PaginationDto, type?: CategoryType, includeDeleted?: boolean): Promise<import("../../common/interfaces/pagination.interface").PaginatedResponse<import("./entities/category.entity").Category>>;
    findOne(id: string, includeDeleted?: boolean): Promise<import("./entities/category.entity").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./entities/category.entity").Category>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/category.entity").Category>;
}
