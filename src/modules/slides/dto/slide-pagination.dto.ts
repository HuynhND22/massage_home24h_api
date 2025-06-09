import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { SlideRole } from '../entities/slide.entity';

export class SlidePaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Role to filter slides', enum: SlideRole })
  @IsOptional()
  @IsEnum(SlideRole)
  role?: SlideRole;
} 