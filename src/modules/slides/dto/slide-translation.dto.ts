import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseTranslationDto, Language } from '../../../common/dto/base-translation.dto';

export class CreateSlideTranslationDto extends BaseTranslationDto {
  @ApiProperty({
    example: 'Welcome to our spa',
    description: 'Title of the slide'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Experience luxury and relaxation',
    description: 'Description of the slide'
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSlideTranslationDto extends BaseTranslationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    example: 'Welcome to our spa',
    description: 'Title of the slide'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Experience luxury and relaxation',
    description: 'Description of the slide'
  })
  @IsString()
  @IsOptional()
  description?: string;
} 