"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogTranslationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_blog_translation_dto_1 = require("./create-blog-translation.dto");
class UpdateBlogTranslationDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_blog_translation_dto_1.CreateBlogTranslationDto, ['blogId', 'language'])) {
}
exports.UpdateBlogTranslationDto = UpdateBlogTranslationDto;
//# sourceMappingURL=update-blog-translation.dto.js.map