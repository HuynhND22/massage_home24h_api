import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slide, SlideRole } from './entities/slide.entity';
import { SlideTranslation } from './entities/slide-translation.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { CreateSlideTranslationDto } from './dto/slide-translation.dto';
import { UpdateSlideTranslationDto } from './dto/slide-translation.dto';
import { SlidePaginationDto } from './dto/slide-pagination.dto';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private readonly slidesRepository: Repository<Slide>,
    @InjectRepository(SlideTranslation)
    private slideTranslationsRepository: Repository<SlideTranslation>,
  ) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const slide = this.slidesRepository.create(createSlideDto);
    await this.slidesRepository.save(slide);

    if (createSlideDto.translations) {
      const translations = createSlideDto.translations.map(translation => ({
        ...translation,
        slideId: slide.id,
      }));

      await this.slideTranslationsRepository.save(translations);
    }

    return this.findOne(slide.id);
  }

  async findAll(
    paginationDto: SlidePaginationDto,
    includeDeleted = false,
  ): Promise<{ data: Slide[]; total: number }> {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const role = paginationDto.role;

    const queryBuilder = this.slidesRepository.createQueryBuilder('slide')
      .leftJoinAndSelect('slide.translations', 'translations');

    if (includeDeleted) {
      queryBuilder.withDeleted();
    }

    if (role) {
      queryBuilder.andWhere('slide.role = :role', { role });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string, includeDeleted = false): Promise<Slide> {
    const options = {
      where: { id },
      relations: ['translations'],
      withDeleted: includeDeleted,
    };

    const slide = await this.slidesRepository.findOne(options);

    if (!slide) {
      throw new NotFoundException(`Slide with ID "${id}" not found`);
    }

    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const slide = await this.findOne(id);
    
    // Update main slide entity
    Object.assign(slide, updateSlideDto);
    await this.slidesRepository.save(slide);
    
    // Update translations if provided
    if (updateSlideDto.translations) {
      for (const translationDto of updateSlideDto.translations) {
        if (translationDto.id) {
          // Update existing translation
          await this.slideTranslationsRepository.update(
            translationDto.id,
            translationDto,
          );
        } else {
          // Create new translation
          await this.slideTranslationsRepository.save({
            ...translationDto,
            slideId: id,
          });
        }
      }
    }
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<Slide> {
    try {
      // Tìm slide kể cả đã bị soft delete
      const slide = await this.findOne(id, true);
      console.log('Found slide:', slide);
      
      await this.slidesRepository.manager.transaction(async transactionalEntityManager => {
        try {
          // Soft delete translations first
          console.log('Soft deleting translations for slide:', id);
          const translationResult = await transactionalEntityManager
            .getRepository(SlideTranslation)
            .softDelete({ slideId: id });
          console.log('Translation delete result:', translationResult);
          
          // Then soft delete the slide
          console.log('Soft deleting slide:', id);
          const slideResult = await transactionalEntityManager
            .getRepository(Slide)
            .softDelete(id);
          console.log('Slide delete result:', slideResult);
        } catch (transactionError) {
          console.error('Error in transaction:', transactionError);
          throw transactionError;
        }
      });

      return slide;
    } catch (error) {
      console.error('Error in remove method:', error);
      throw error;
    }
  }

  async restore(id: string): Promise<Slide> {
    const slide = await this.findOne(id, true);
    
    if (!slide.deletedAt) {
      throw new BadRequestException('Slide is not deleted');
    }
    
    await this.slidesRepository.restore(id);
    return this.findOne(id);
  }

  async findDeleted(page = 1, limit = 10, role?: SlideRole): Promise<{ data: Slide[]; total: number }> {
    const queryBuilder = this.slidesRepository.createQueryBuilder('slide')
      .leftJoinAndSelect('slide.translations', 'translations')
      .where('slide.deletedAt IS NOT NULL');

    if (role) {
      queryBuilder.andWhere('slide.role = :role', { role });
    }

    const total = await queryBuilder.getCount();

    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, total };
  }
}
