import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SlideRole } from './entities/slide.entity';
export declare class SlidesController {
    private readonly slidesService;
    constructor(slidesService: SlidesService);
    create(createSlideDto: CreateSlideDto): Promise<import("./entities/slide.entity").Slide>;
    findAll(paginationDto: PaginationDto, role?: SlideRole, includeDeleted?: boolean): Promise<import("../../common/interfaces/pagination.interface").PaginatedResponse<import("./entities/slide.entity").Slide>>;
    findOne(id: string, includeDeleted?: boolean): Promise<import("./entities/slide.entity").Slide>;
    update(id: string, updateSlideDto: UpdateSlideDto): Promise<import("./entities/slide.entity").Slide>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/slide.entity").Slide>;
}
