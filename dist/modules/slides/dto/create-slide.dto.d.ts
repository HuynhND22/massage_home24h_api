import { SlideRole } from '../entities/slide.entity';
export declare class CreateSlideDto {
    title: string;
    description?: string;
    image: string;
    role: SlideRole;
    order?: number;
}
