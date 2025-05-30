import { BaseEntity } from '../../../common/entities/base.entity';
import { Blog } from '../../blogs/entities/blog.entity';
import { Service } from '../../services/entities/service.entity';
export declare enum CategoryType {
    BLOG = "blog",
    SERVICE = "service"
}
export declare class Category extends BaseEntity {
    name: string;
    description: string;
    type: CategoryType;
    coverImage: string;
    blogs: Blog[];
    services: Service[];
}
