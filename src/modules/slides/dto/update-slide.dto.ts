import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, ArrayMinSize, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { SlideRole } from '../entities/slide.entity';
import { UpdateSlideTranslationDto } from './slide-translation.dto';

export class UpdateSlideDto {
  @ApiProperty({
    example: 'https://example.com/slide.jpg',
    description: 'Image URL of the slide',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    enum: SlideRole,
    example: SlideRole.HOME,
    description: 'Role/location of the slide',
  })
  @IsEnum(SlideRole)
  @IsNotEmpty()
  role: SlideRole;

  @ApiProperty({
    example: 1,
    description: 'Order/position of the slide',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({
    type: [UpdateSlideTranslationDto],
    description: 'Translations for the slide (at least one translation required)',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateSlideTranslationDto)
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  translations: UpdateSlideTranslationDto[];
}
