"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const web_setting_entity_1 = require("./entities/web-setting.entity");
let WebSettingsService = class WebSettingsService {
    webSettingsRepository;
    constructor(webSettingsRepository) {
        this.webSettingsRepository = webSettingsRepository;
    }
    async create(createWebSettingDto) {
        const existingSettings = await this.webSettingsRepository.find();
        if (existingSettings.length > 0) {
            throw new Error('Web settings already exist. Use update instead.');
        }
        const webSetting = this.webSettingsRepository.create(createWebSettingDto);
        return this.webSettingsRepository.save(webSetting);
    }
    async findOne(includeDeleted = false) {
        const webSetting = await this.webSettingsRepository.findOne({
            where: {},
            withDeleted: includeDeleted,
            order: { createdAt: 'DESC' },
        });
        if (!webSetting) {
            throw new common_1.NotFoundException('Web settings not found');
        }
        return webSetting;
    }
    async update(id, updateWebSettingDto) {
        const webSetting = await this.webSettingsRepository.findOne({
            where: { id },
        });
        if (!webSetting) {
            throw new common_1.NotFoundException(`Web settings with ID ${id} not found`);
        }
        Object.assign(webSetting, updateWebSettingDto);
        return this.webSettingsRepository.save(webSetting);
    }
    async remove(id) {
        const webSetting = await this.webSettingsRepository.findOne({
            where: { id },
        });
        if (!webSetting) {
            throw new common_1.NotFoundException(`Web settings with ID ${id} not found`);
        }
        await this.webSettingsRepository.softDelete(id);
    }
    async restore(id) {
        const webSetting = await this.webSettingsRepository.findOne({
            where: { id },
            withDeleted: true,
        });
        if (!webSetting) {
            throw new common_1.NotFoundException(`Web settings with ID ${id} not found`);
        }
        if (!webSetting.deletedAt) {
            throw new Error('Web settings are not deleted');
        }
        await this.webSettingsRepository.restore(id);
        return this.findOne();
    }
};
exports.WebSettingsService = WebSettingsService;
exports.WebSettingsService = WebSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(web_setting_entity_1.WebSetting)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WebSettingsService);
//# sourceMappingURL=web-settings.service.js.map