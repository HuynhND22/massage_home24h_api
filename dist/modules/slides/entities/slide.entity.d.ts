import { BaseEntity } from '../../../common/entities/base.entity';
export declare enum SlideRole {
    HOME = "home",
    ABOUT = "about",
    SERVICE = "service"
}
export declare class Slide extends BaseEntity {
    title: string;
    description: string;
    image: string;
    role: SlideRole;
    order: number;
}
