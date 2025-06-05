import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseTranslationDto, Language } from '../../../common/dto/base-translation.dto';

export class CreateSlideTranslationDto extends BaseTranslationDto {
  @ApiProperty({
    example: 'Welcome to Our Spa',
    description: 'Title of the slide',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Experience the ultimate relaxation',
    description: 'Description of the slide',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSlideTranslationDto extends CreateSlideTranslationDto {} 