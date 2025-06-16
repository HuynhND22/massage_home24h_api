import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseTranslationDto, Language } from '../../../common/dto/base-translation.dto';

export class CreateServiceTranslationDto extends BaseTranslationDto {
  @ApiProperty({
    example: 'Massage Body',
    description: 'Name of the service'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Professional body massage service',
    description: 'Description of the service'
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateServiceTranslationDto extends BaseTranslationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    example: 'Massage Body',
    description: 'Name of the service'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Professional body massage service',
    description: 'Description of the service'
  })
  @IsString()
  @IsOptional()
  description?: string;
} 