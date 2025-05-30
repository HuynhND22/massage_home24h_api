"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWebSettingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_web_setting_dto_1 = require("./create-web-setting.dto");
class UpdateWebSettingDto extends (0, swagger_1.PartialType)(create_web_setting_dto_1.CreateWebSettingDto) {
}
exports.UpdateWebSettingDto = UpdateWebSettingDto;
//# sourceMappingURL=update-web-setting.dto.js.map