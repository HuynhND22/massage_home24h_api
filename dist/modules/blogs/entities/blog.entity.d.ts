import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { BlogTranslation } from './blog-translation.entity';
export declare class Blog extends BaseEntity {
    title: string;
    description: string;
    content: string;
    slug: string;
    coverImage: string;
    categoryId: string;
    category: Category;
    translations: BlogTranslation[];
    viewCount: number;
}
