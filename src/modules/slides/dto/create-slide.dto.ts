import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SlideRole } from '../entities/slide.entity';

export class CreateSlideDto {
  @ApiProperty({
    example: 'Relaxing Massage Experience',
    description: 'Title of the slide',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Experience the most relaxing massage in town',
    description: 'Description of the slide',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

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
  @Min(0)
  @IsOptional()
  order?: number;
}
