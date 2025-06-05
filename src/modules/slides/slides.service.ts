import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide, SlideRole } from './entities/slide.entity';
import { SlideTranslation } from './entities/slide-translation.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { CreateSlideTranslationDto } from './dto/slide-translation.dto';
import { UpdateSlideTranslationDto } from './dto/slide-translation.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private slidesRepository: Repository<Slide>,
    @InjectRepository(SlideTranslation)
    private slideTranslationsRepository: Repository<SlideTranslation>,
  ) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const { translations, ...slideData } = createSlideDto;
    const slide = this.slidesRepository.create(slideData);
    
    if (translations) {
      slide.translations = translations.map(translation => 
        this.slideTranslationsRepository.create(translation)
      );
    }
    
    return this.slidesRepository.save(slide);
  }

  async findAll(
    params: PaginationParams & { role?: SlideRole },
    includeDeleted: boolean = false,
  ): Promise<PaginatedResponse<Slide>> {
    const { page = 1, limit = 10, search, sortBy = 'order', sortOrder = 'ASC', role } = params;
    
    const queryBuilder = this.slidesRepository.createQueryBuilder('slide')
      .leftJoinAndSelect('slide.translations', 'translations');
    
    if (includeDeleted) {
      queryBuilder.withDeleted();
    }
    
    if (role) {
      queryBuilder.andWhere('slide.role = :role', { role });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(translations.title ILIKE :search OR translations.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    const totalItems = await queryBuilder.getCount();
    
    queryBuilder
      .orderBy(`slide.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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

  async findOne(id: string, includeDeleted: boolean = false): Promise<Slide> {
    const slide = await this.slidesRepository.findOne({
      where: { id },
      relations: ['translations'],
      withDeleted: includeDeleted,
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }

    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const { translations, ...slideData } = updateSlideDto;
    const slide = await this.findOne(id);
    
    Object.assign(slide, slideData);
    
    if (translations) {
      // Remove existing translations
      await this.slideTranslationsRepository.delete({ slideId: id });
      
      // Create new translations
      slide.translations = translations.map(translation => 
        this.slideTranslationsRepository.create({
          ...translation,
          slideId: id,
        })
      );
    }
    
    return this.slidesRepository.save(slide);
  }

  async remove(id: string): Promise<void> {
    const slide = await this.findOne(id);
    await this.slidesRepository.softDelete(id);
  }

  async restore(id: string): Promise<Slide> {
    const slide = await this.findOne(id, true);
    
    if (!slide.deletedAt) {
      throw new Error('Slide is not deleted');
    }
    
    await this.slidesRepository.restore(id);
    return this.findOne(id);
  }
}
