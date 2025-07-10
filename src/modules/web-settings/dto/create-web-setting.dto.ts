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
    example: 'https://m.me/spa-page',
    description: 'Facebook Messenger URL of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  messenger?: string;

  @ApiProperty({
    example: 'https://example.com/qr/messenger.png',
    description: 'QR code image URL for Facebook Messenger',
    required: false,
  })
  @IsString()
  @IsOptional()
  messengerQr?: string;

  @ApiProperty({
    example: 'https://zalo.me/spa-page',
    description: 'Zalo URL of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  zalo?: string;

  @ApiProperty({
    example: 'https://example.com/qr/zalo.png',
    description: 'QR code image URL for Zalo',
    required: false,
  })
  @IsString()
  @IsOptional()
  zaloQr?: string;

  @ApiProperty({
    example: 'wxid_xxxxxx',
    description: 'WeChat ID of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  wechat?: string;

  @ApiProperty({
    example: 'https://example.com/qr/wechat.png',
    description: 'QR code image URL for WeChat',
    required: false,
  })
  @IsString()
  @IsOptional()
  wechatQr?: string;

  @ApiProperty({
    example: 'https://t.me/spa-page',
    description: 'Telegram URL or username of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiProperty({
    example: 'https://example.com/qr/telegram.png',
    description: 'QR code image URL for Telegram',
    required: false,
  })
  @IsString()
  @IsOptional()
  telegramQr?: string;

  @ApiProperty({
    example: 'https://line.me/spa-page',
    description: 'Line URL or ID of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  line?: string;

  @ApiProperty({
    example: 'https://example.com/qr/line.png',
    description: 'QR code image URL for Line',
    required: false,
  })
  @IsString()
  @IsOptional()
  lineQr?: string;

  @ApiProperty({
    example: 'https://open.kakao.com/spa-page',
    description: 'KakaoTalk URL or ID of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  kakaotalk?: string;

  @ApiProperty({
    example: 'https://example.com/qr/kakaotalk.png',
    description: 'QR code image URL for KakaoTalk',
    required: false,
  })
  @IsString()
  @IsOptional()
  kakaotalkQr?: string;

  @ApiProperty({
    example: '84901234567',
    description: 'WhatsApp phone number of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({
    example: 'https://example.com/qr/whatsapp.png',
    description: 'QR code image URL for WhatsApp',
    required: false,
  })
  @IsString()
  @IsOptional()
  whatsappQr?: string;

  @ApiProperty({
    example: 'spa_instagram',
    description: 'Instagram username of the business',
    required: false,
  })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    example: 'https://example.com/qr/instagram.png',
    description: 'QR code image URL for Instagram',
    required: false,
  })
  @IsString()
  @IsOptional()
  instagramQr?: string;
}
