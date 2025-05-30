import { Repository } from 'typeorm';
import { Slide, SlideRole } from './entities/slide.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';
export declare class SlidesService {
    private slidesRepository;
    constructor(slidesRepository: Repository<Slide>);
    create(createSlideDto: CreateSlideDto): Promise<Slide>;
    findAll(params: PaginationParams & {
        role?: SlideRole;
    }, includeDeleted?: boolean): Promise<PaginatedResponse<Slide>>;
    findOne(id: string, includeDeleted?: boolean): Promise<Slide>;
    update(id: string, updateSlideDto: UpdateSlideDto): Promise<Slide>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<Slide>;
}
