import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseTranslationDto, Language } from '../../../common/dto/base-translation.dto';

export class CreateCategoryTranslationDto extends BaseTranslationDto {
  @ApiProperty({
    example: 'Massage Services',
    description: 'Name of the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'All types of massage services offered',
    description: 'Description of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryTranslationDto extends CreateCategoryTranslationDto {} 