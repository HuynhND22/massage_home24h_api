"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSettingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const web_settings_service_1 = require("./web-settings.service");
const web_settings_controller_1 = require("./web-settings.controller");
const web_setting_entity_1 = require("./entities/web-setting.entity");
let WebSettingsModule = class WebSettingsModule {
};
exports.WebSettingsModule = WebSettingsModule;
exports.WebSettingsModule = WebSettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([web_setting_entity_1.WebSetting])],
        controllers: [web_settings_controller_1.WebSettingsController],
        providers: [web_settings_service_1.WebSettingsService],
        exports: [web_settings_service_1.WebSettingsService],
    })
], WebSettingsModule);
//# sourceMappingURL=web-settings.module.js.map