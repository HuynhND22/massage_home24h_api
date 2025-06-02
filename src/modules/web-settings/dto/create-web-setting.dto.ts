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
    example: 'https://zalo.me/spa-page',
    description: 'Zalo URL of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  zalo?: string;

  @ApiProperty({
    example: 'https://open.kakao.com/spa-page',
    description: 'KakaoTalk URL or ID of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  kakaotalk?: string;

  @ApiProperty({
    example: 'https://t.me/spa-page',
    description: 'Telegram URL or username of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiProperty({
    example: 'wxid_xxxxxx',
    description: 'WeChat ID of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  wechat?: string;

  @ApiProperty({
    example: 'https://line.me/spa-page',
    description: 'Line URL or ID of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  line?: string;
}
