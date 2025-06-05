import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseTranslationDto, Language } from '../../../common/dto/base-translation.dto';

export class CreateServiceTranslationDto extends BaseTranslationDto {
  @ApiProperty({
    example: 'Thai Massage',
    description: 'Name of the service',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Traditional Thai massage therapy',
    description: 'Description of the service',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateServiceTranslationDto extends CreateServiceTranslationDto {} 