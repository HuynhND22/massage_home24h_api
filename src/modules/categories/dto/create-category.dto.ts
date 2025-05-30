import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
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

  @ApiProperty({
    enum: CategoryType,
    example: CategoryType.SERVICE,
    description: 'Type of the category',
  })
  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Cover image URL of the category',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;
}
