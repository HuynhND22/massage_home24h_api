import { CreateBlogTranslationDto } from './create-blog-translation.dto';
declare const UpdateBlogTranslationDto_base: import("@nestjs/common").Type<Partial<Omit<CreateBlogTranslationDto, "blogId" | "language">>>;
export declare class UpdateBlogTranslationDto extends UpdateBlogTranslationDto_base {
}
export {};
