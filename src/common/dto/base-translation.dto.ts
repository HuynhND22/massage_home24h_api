import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Language {
  VI = 'vi',
  EN = 'en',
  KO = 'ko',
  ZH = 'zh',
}

export class BaseTranslationDto {
  @ApiProperty({
    enum: Language,
    example: Language.VI,
    description: 'Language code',
  })
  @IsEnum(Language)
  @IsNotEmpty()
  language: Language;
} 