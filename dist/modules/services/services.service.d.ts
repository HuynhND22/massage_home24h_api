import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';
export declare class ServicesService {
    private servicesRepository;
    constructor(servicesRepository: Repository<Service>);
    create(createServiceDto: CreateServiceDto): Promise<Service>;
    findAll(params: PaginationParams & {
        categoryId?: string;
    }, includeDeleted?: boolean): Promise<PaginatedResponse<Service>>;
    findOne(id: string, includeDeleted?: boolean): Promise<Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<Service>;
}
