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
import { Language } from '../../common/dto/base-translation.dto';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide)
    private readonly slidesRepository: Repository<Slide>,
    @InjectRepository(SlideTranslation)
    private slideTranslationsRepository: Repository<SlideTranslation>,
  ) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const { translations, ...slideData } = createSlideDto;

    // Validate that all required languages are present
    const requiredLanguages = [Language.EN, Language.VI, Language.KO, Language.ZH];
    const providedLanguages = translations.map(t => t.language);
    const missingLanguages = requiredLanguages.filter(lang => !providedLanguages.includes(lang));
    
    if (missingLanguages.length > 0) {
      throw new BadRequestException(`Missing translations for languages: ${missingLanguages.join(', ')}`);
    }

    return this.slidesRepository.manager.transaction(async transactionalEntityManager => {
      // Create and save the slide
      const slide = this.slidesRepository.create(slideData);
      const savedSlide = await transactionalEntityManager.save(Slide, slide);

      // Create and save translations
      const slideTranslations = translations.map(translation => 
        this.slideTranslationsRepository.create({
        ...translation,
          slideId: savedSlide.id
        })
      );

      await transactionalEntityManager.save(SlideTranslation, slideTranslations);
      savedSlide.translations = slideTranslations;

      return savedSlide;
    });
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
    const slide = await this.slidesRepository.findOne({
      where: { id },
      relations: ['translations'],
      withDeleted: includeDeleted,
    });

    if (!slide) {
      throw new NotFoundException(`Slide with ID "${id}" not found`);
    }

    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const { translations, ...slideData } = updateSlideDto;
    
    return this.slidesRepository.manager.transaction(async transactionalEntityManager => {
      // Get the slide with its current translations
      const slide = await this.findOne(id);
      
      // Update basic slide data
      Object.assign(slide, slideData);
      await transactionalEntityManager.save(Slide, slide);
      
      if (translations && translations.length > 0) {
        // Update or create translations
        for (const translation of translations) {
          // Use queryBuilder to ensure we get the latest data
          const existingTranslation = await transactionalEntityManager
            .getRepository(SlideTranslation)
            .createQueryBuilder('translation')
            .where('translation.slideId = :slideId', { slideId: id })
            .andWhere('translation.language = :language', { language: translation.language })
            .getOne();
          
          if (existingTranslation) {
            // Update existing translation
            await transactionalEntityManager
              .getRepository(SlideTranslation)
              .createQueryBuilder()
              .update()
              .set({
                title: translation.title,
                description: translation.description || existingTranslation.description
              })
              .where('id = :id', { id: existingTranslation.id })
              .execute();
          } else {
            // Create new translation
            await transactionalEntityManager
              .getRepository(SlideTranslation)
              .createQueryBuilder()
              .insert()
              .values({
                slideId: id,
                language: translation.language,
                title: translation.title,
                description: translation.description || ''
              })
              .execute();
          }
        }
      }
      
      // Fetch and return the updated slide with all translations
      const updatedSlide = await transactionalEntityManager
        .getRepository(Slide)
        .createQueryBuilder('slide')
        .leftJoinAndSelect('slide.translations', 'translations')
        .where('slide.id = :id', { id })
        .getOne();

      if (!updatedSlide) {
        throw new NotFoundException(`Slide with ID "${id}" not found`);
      }

      return updatedSlide;
    });
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
