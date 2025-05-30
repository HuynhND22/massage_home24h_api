import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Max, Min } from 'class-validator';

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
  @IsPositive()
  duration: number;

  @ApiProperty({
    example: 50.99,
    description: 'Price of the service',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    example: 5.99,
    description: 'Discount amount for the service',
    required: false,
  })
  @IsNumber()
  @Min(0)
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
}
