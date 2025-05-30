import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBlogTranslationDto } from './create-blog-translation.dto';

export class UpdateBlogTranslationDto extends PartialType(
  OmitType(CreateBlogTranslationDto, ['blogId', 'language'] as const),
) {}
