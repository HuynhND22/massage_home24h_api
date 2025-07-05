import { Injectable, NotFoundException, BadRequestException, HttpStatus } from '@nestjs/common';
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
import { CreateServiceDetailDto } from './dto/create-service-detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service-detail.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Language } from '../../common/dto/base-translation.dto';

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
    const { translations, ...serviceData } = createServiceDto;

    // Validate that all required languages are present
    const requiredLanguages = [Language.EN, Language.VI, Language.KO, Language.ZH];
    const providedLanguages = translations.map(t => t.language);
    const missingLanguages = requiredLanguages.filter(lang => !providedLanguages.includes(lang));
    
    if (missingLanguages.length > 0) {
      throw new BadRequestException(`Missing translations for languages: ${missingLanguages.join(', ')}`);
    }

    return this.servicesRepository.manager.transaction(async transactionalEntityManager => {
      // Create and save the service
      const service = this.servicesRepository.create(serviceData);
      const savedService = await transactionalEntityManager.save(Service, service);

      // Create and save translations
      const serviceTranslations = translations.map(translation => 
        this.serviceTranslationsRepository.create({
          ...translation,
          serviceId: savedService.id
        })
      );
      
      await transactionalEntityManager.save(ServiceTranslation, serviceTranslations);
      savedService.translations = serviceTranslations;

      return savedService;
    });
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

    if (data.length === 0) {
      throw new NotFoundException({
        statusCode: HttpStatus.NO_CONTENT,
        message: 'No services found',
      });
    }

    return { data, total };
  }

  async findOne(id: string, includeDeleted = false): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['translations', 'category', 'details'],
      withDeleted: includeDeleted,
    });

    if (!service) {
      throw new NotFoundException({
        statusCode: HttpStatus.NO_CONTENT,
        message: `Service with ID "${id}" not found`,
      });
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const { translations, ...serviceData } = updateServiceDto;
    
    return this.servicesRepository.manager.transaction(async transactionalEntityManager => {
      // Get the service with its current translations
      const service = await this.findOne(id);
      
      // Update basic service data
      Object.assign(service, serviceData);
      await transactionalEntityManager.save(Service, service);
      
      if (translations && translations.length > 0) {
        // Update or create translations
        for (const translation of translations) {
          // Use queryBuilder to ensure we get the latest data
          const existingTranslation = await transactionalEntityManager
            .getRepository(ServiceTranslation)
            .createQueryBuilder('translation')
            .where('translation.serviceId = :serviceId', { serviceId: id })
            .andWhere('translation.language = :language', { language: translation.language })
            .getOne();
          
          if (existingTranslation) {
            // Update existing translation
            await transactionalEntityManager
              .getRepository(ServiceTranslation)
              .createQueryBuilder()
              .update()
              .set({
                name: translation.name,
                description: translation.description || existingTranslation.description
              })
              .where('id = :id', { id: existingTranslation.id })
              .execute();
          } else {
            // Create new translation
            await transactionalEntityManager
              .getRepository(ServiceTranslation)
              .createQueryBuilder()
              .insert()
              .values({
                serviceId: id,
                language: translation.language,
                name: translation.name,
                description: translation.description || ''
              })
              .execute();
          }
        }
      }
      
      // Fetch and return the updated service with all translations
      const updatedService = await transactionalEntityManager
        .getRepository(Service)
        .createQueryBuilder('service')
        .leftJoinAndSelect('service.translations', 'translations')
        .leftJoinAndSelect('service.category', 'category')
        .where('service.id = :id', { id })
        .getOne();

      if (!updatedService) {
        throw new NotFoundException({
          statusCode: HttpStatus.NO_CONTENT,
          message: `Service with ID "${id}" not found`,
        });
      }

      return updatedService;
    });
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
      throw new NotFoundException({
        statusCode: HttpStatus.NO_CONTENT,
        message: `Service with slug "${slug}" not found`,
      });
    }

    return service;
  }

  async createServiceDetail(createServiceDetailDto: CreateServiceDetailDto): Promise<ServiceDetail> {
    // Check if service exists
    const service = await this.servicesRepository.findOne({
      where: { id: createServiceDetailDto.serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID "${createServiceDetailDto.serviceId}" not found`);
    }

    // Check if service detail with same language already exists
    const existingDetail = await this.serviceDetailsRepository.findOne({
      where: {
        serviceId: createServiceDetailDto.serviceId,
        language: createServiceDetailDto.language,
      },
    });

    if (existingDetail) {
      throw new NotFoundException(`Service detail with language "${createServiceDetailDto.language}" already exists for this service`);
    }

    const serviceDetail = this.serviceDetailsRepository.create(createServiceDetailDto);
    return this.serviceDetailsRepository.save(serviceDetail);
  }

  async updateServiceDetail(id: string, updateServiceDetailDto: UpdateServiceDetailDto): Promise<ServiceDetail> {
    // Kiểm tra service detail có tồn tại không
    const existingDetail = await this.serviceDetailsRepository.findOne({
      where: { id },
    });

    if (!existingDetail) {
      throw new NotFoundException(`Service detail with ID "${id}" not found`);
    }

    // Kiểm tra service có tồn tại không
    const service = await this.servicesRepository.findOne({
      where: { id: updateServiceDetailDto.serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID "${updateServiceDetailDto.serviceId}" not found`);
    }

    // Kiểm tra xem có detail khác cùng ngôn ngữ không (trừ detail hiện tại)
    const duplicateDetail = await this.serviceDetailsRepository
      .createQueryBuilder('detail')
      .where('detail.serviceId = :serviceId', { serviceId: updateServiceDetailDto.serviceId })
      .andWhere('detail.language = :language', { language: updateServiceDetailDto.language })
      .andWhere('detail.id != :id', { id })
      .getOne();

    if (duplicateDetail) {
      throw new BadRequestException(`Another service detail with language "${updateServiceDetailDto.language}" already exists for this service`);
    }

    // Cập nhật detail
    await this.serviceDetailsRepository.update(id, updateServiceDetailDto);

    // Trả về detail đã cập nhật
    const updatedDetail = await this.serviceDetailsRepository.findOne({
      where: { id },
    });

    if (!updatedDetail) {
      throw new NotFoundException(`Service detail with ID "${id}" not found after update`);
    }

    return updatedDetail;
  }
}
