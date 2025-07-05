import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Language } from '../../../common/dto/base-translation.dto';

export class UpdateServiceDetailDto {
  @ApiProperty({ description: 'ID của dịch vụ' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ description: 'Ngôn ngữ', enum: Language })
  @IsString()
  @IsNotEmpty()
  language: Language;

  @ApiProperty({ description: 'Tiêu đề' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Mô tả ngắn' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Nội dung chi tiết' })
  @IsString()
  @IsNotEmpty()
  content: string;
} 