import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateServiceTranslationDto } from './service-translation.dto';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Thai Massage',
    description: 'Name of the service',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Traditional Thai massage technique',
    description: 'Description of the service',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 60,
    description: 'Duration of the service in minutes',
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    example: 100.00,
    description: 'Price of the service',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 0,
    description: 'Discount amount for the service',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Cover image URL of the service',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the category this service belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    type: [CreateServiceTranslationDto],
    description: 'Translations for the service',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateServiceTranslationDto)
  translations: CreateServiceTranslationDto[];
}
