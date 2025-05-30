import { BaseEntity } from '../../../common/entities/base.entity';
import { Blog } from './blog.entity';
export declare class BlogTranslation extends BaseEntity {
    blogId: string;
    language: string;
    title: string;
    description: string;
    content: string;
    blog: Blog;
}
