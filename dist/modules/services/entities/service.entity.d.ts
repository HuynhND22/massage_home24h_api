import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Service extends BaseEntity {
    name: string;
    description: string;
    duration: number;
    price: number;
    discount: number;
    coverImage: string;
    categoryId: string;
    category: Category;
}
