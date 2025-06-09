import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ServicePaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Category ID to filter services' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
} 