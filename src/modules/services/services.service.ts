import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceTranslation } from './entities/service-translation.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceTranslationDto } from './dto/service-translation.dto';
import { UpdateServiceTranslationDto } from './dto/service-translation.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(ServiceTranslation)
    private serviceTranslationsRepository: Repository<ServiceTranslation>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const { translations, ...serviceData } = createServiceDto;
    
    return this.servicesRepository.manager.transaction(async transactionalEntityManager => {
      // Create and save the service
      const service = this.servicesRepository.create(serviceData);
      const savedService = await transactionalEntityManager.save(Service, service);
      
      if (translations && translations.length > 0) {
        // Create and save translations
        const serviceTranslations = translations.map(translation => 
          this.serviceTranslationsRepository.create({
            ...translation,
            serviceId: savedService.id
          })
        );
        
        await transactionalEntityManager.save(ServiceTranslation, serviceTranslations);
        savedService.translations = serviceTranslations;
      }
      
      return savedService;
    });
  }

  async findAll(
    params: PaginationParams & { categoryId?: string },
    includeDeleted: boolean = false,
  ): Promise<PaginatedResponse<Service>> {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'DESC', categoryId } = params;
    
    const queryBuilder = this.servicesRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.category', 'category')
      .leftJoinAndSelect('service.translations', 'translations');
    
    if (includeDeleted) {
      queryBuilder.withDeleted();
    }
    
    if (categoryId) {
      queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(translations.name ILIKE :search OR translations.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    const totalItems = await queryBuilder.getCount();
    
    queryBuilder
      .orderBy(`service.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const items = await queryBuilder.getMany();
    
    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string, includeDeleted: boolean = false): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['category', 'translations'],
      withDeleted: includeDeleted,
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const { translations, ...serviceData } = updateServiceDto;
    const service = await this.findOne(id);
    
    Object.assign(service, serviceData);
    
    if (translations) {
      // Remove existing translations
      await this.serviceTranslationsRepository.delete({ serviceId: id });
      
      // Create new translations
      service.translations = translations.map(translation => 
        this.serviceTranslationsRepository.create({
          ...translation,
          serviceId: id,
        })
      );
    }
    
    return this.servicesRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.servicesRepository.softDelete(id);
  }

  async restore(id: string): Promise<Service> {
    const service = await this.findOne(id, true);
    
    if (!service.deletedAt) {
      throw new Error('Service is not deleted');
    }
    
    await this.servicesRepository.restore(id);
    return this.findOne(id);
  }
}
