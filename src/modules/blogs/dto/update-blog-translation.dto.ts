import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseTranslationDto } from '../../../common/dto/base-translation.dto';

export class UpdateBlogTranslationDto extends BaseTranslationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    example: 'Lợi ích của Massage Thái',
    description: 'Translated title of the blog post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Khám phá những lợi ích tuyệt vời cho sức khỏe từ massage Thái truyền thống',
    description: 'Translated short description of the blog post',
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
