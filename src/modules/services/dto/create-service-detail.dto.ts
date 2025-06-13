import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateServiceDetailDto {
  @ApiProperty({ description: 'Title of the service detail' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the service detail' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Content of the service detail' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Language of the service detail' })
  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty({ description: 'ID of the service this detail belongs to' })
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;
} 