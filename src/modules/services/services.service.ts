import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { ServiceTranslation } from './entities/service-translation.entity';
import { ServiceDetail } from './entities/service-detail.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceTranslationDto } from './dto/service-translation.dto';
import { UpdateServiceTranslationDto } from './dto/service-translation.dto';
import { ServicePaginationDto } from './dto/service-pagination.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    @InjectRepository(ServiceTranslation)
    private serviceTranslationsRepository: Repository<ServiceTranslation>,
    @InjectRepository(ServiceDetail)
    private serviceDetailsRepository: Repository<ServiceDetail>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.servicesRepository.create(createServiceDto);
    await this.servicesRepository.save(service);

    if (createServiceDto.translations) {
      const translations = createServiceDto.translations.map(translation => ({
        ...translation,
        serviceId: service.id,
      }));

      await this.serviceTranslationsRepository.save(translations);
    }

    return this.findOne(service.id);
  }

  async findAll(
    paginationDto: ServicePaginationDto,
    includeDeleted = false,
  ): Promise<{ data: Service[]; total: number }> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const categoryId = paginationDto.categoryId;

    const queryBuilder = this.servicesRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.translations', 'translations')
      .leftJoinAndSelect('service.category', 'category');

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    if (categoryId) {
      queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string, includeDeleted = false): Promise<Service> {
    const options = {
      where: { id },
      relations: ['translations', 'category'],
      withDeleted: includeDeleted,
    };

    const service = await this.servicesRepository.findOne(options);

    if (!service) {
      throw new NotFoundException(`Service with ID "${id}" not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    
    // Update main service entity
    Object.assign(service, updateServiceDto);
    await this.servicesRepository.save(service);
    
    // Update translations if provided
    if (updateServiceDto.translations) {
      for (const translationDto of updateServiceDto.translations) {
        if (translationDto.id) {
          // Update existing translation
          await this.serviceTranslationsRepository.update(
            translationDto.id,
            translationDto,
          );
        } else {
          // Create new translation
          await this.serviceTranslationsRepository.save({
            ...translationDto,
            serviceId: id,
          });
        }
      }
    }
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<Service> {
    try {
      // Tìm service kể cả đã bị soft delete
      const service = await this.findOne(id, true);
      console.log('Found service:', service);
      
      await this.servicesRepository.manager.transaction(async transactionalEntityManager => {
        try {
          // Soft delete translations first
          console.log('Soft deleting translations for service:', id);
          const translationResult = await transactionalEntityManager
            .getRepository(ServiceTranslation)
            .softDelete({ serviceId: id });
          console.log('Translation delete result:', translationResult);

          // Soft delete details
          console.log('Soft deleting details for service:', id);
          const detailResult = await transactionalEntityManager
            .getRepository(ServiceDetail)
            .softDelete({ serviceId: id });
          console.log('Detail delete result:', detailResult);
          
          // Then soft delete the service
          console.log('Soft deleting service:', id);
          const serviceResult = await transactionalEntityManager
            .getRepository(Service)
            .softDelete(id);
          console.log('Service delete result:', serviceResult);
        } catch (transactionError) {
          console.error('Error in transaction:', transactionError);
          throw transactionError;
        }
      });

      return service;
    } catch (error) {
      console.error('Error in remove method:', error);
      throw error;
    }
  }

  async restore(id: string): Promise<Service> {
    const service = await this.findOne(id, true);
    
    if (!service.deletedAt) {
      throw new BadRequestException('Service is not deleted');
    }
    
    await this.servicesRepository.restore(id);
    return this.findOne(id);
  }

  async findDeleted(page = 1, limit = 10, categoryId?: string): Promise<{ data: Service[]; total: number }> {
    const queryBuilder = this.servicesRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.translations', 'translations')
      .leftJoinAndSelect('service.category', 'category')
      .where('service.deletedAt IS NOT NULL');

    if (categoryId) {
      queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId });
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }

  async findBySlug(slug: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { slug },
      relations: ['translations', 'details', 'category'],
    });

    if (!service) {
      throw new NotFoundException(`Service with slug "${slug}" not found`);
    }

    return service;
  }
}
