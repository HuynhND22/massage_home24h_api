import { CategoryType } from '../entities/category.entity';
export declare class CreateCategoryDto {
    name: string;
    description?: string;
    type: CategoryType;
    coverImage?: string;
}
