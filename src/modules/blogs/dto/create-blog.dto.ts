import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Benefits of Thai Massage',
    description: 'Title of the blog post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Discover the amazing health benefits of traditional Thai massage',
    description: 'Short description of the blog post',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '<p>Thai massage is an ancient healing system...</p>',
    description: 'Full content of the blog post in HTML format',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'benefits-of-thai-massage',
    description: 'URL-friendly slug for the blog post',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'Cover image URL of the blog post',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the category this blog belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
