import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBlogTranslationDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the blog post this translation belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  blogId: string;

  @ApiProperty({
    example: 'vi',
    description: 'Language code for this translation (e.g., en, vi, ko)',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    example: 'Lợi ích của Massage Thái',
    description: 'Translated title of the blog post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Khám phá những lợi ích tuyệt vời cho sức khỏe từ massage Thái truyền thống',
    description: 'Translated short description of the blog post',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '<p>Massage Thái là một phương pháp chữa bệnh cổ xưa...</p>',
    description: 'Translated full content of the blog post in HTML format',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
