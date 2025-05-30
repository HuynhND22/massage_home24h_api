import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWebSettingDto {
  @ApiProperty({
    example: 'Spa & Massage Center',
    description: 'Name of the website/business',
  })
  @IsString()
  @IsNotEmpty()
  siteName: string;

  @ApiProperty({
    example: '123 Spa Street, City, Country',
    description: 'Physical address of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Logo URL of the website/business',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    example: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM',
    description: 'Working hours of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  workingHours?: string;

  @ApiProperty({
    example: '<iframe src="https://maps.google.com/..."></iframe>',
    description: 'Google Maps iframe HTML code',
    required: false,
  })
  @IsString()
  @IsOptional()
  googleMap?: string;

  @ApiProperty({
    example: 'contact@spa.com',
    description: 'Contact email of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'https://facebook.com/spa-page',
    description: 'Facebook page URL of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiProperty({
    example: 'https://instagram.com/spa-page',
    description: 'Instagram page URL of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    example: 'https://twitter.com/spa-page',
    description: 'Twitter page URL of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  twitter?: string;
}
