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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWebSettingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateWebSettingDto {
    siteName;
    address;
    logo;
    workingHours;
    googleMap;
    email;
    phone;
    facebook;
    zalo;
    kakaotalk;
    telegram;
    wechat;
    line;
}
exports.CreateWebSettingDto = CreateWebSettingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Spa & Massage Center',
        description: 'Name of the website/business',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "siteName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123 Spa Street, City, Country',
        description: 'Physical address of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/logo.png',
        description: 'Logo URL of the website/business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM',
        description: 'Working hours of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "workingHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '<iframe src="https://maps.google.com/..."></iframe>',
        description: 'Google Maps iframe HTML code',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "googleMap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'contact@spa.com',
        description: 'Contact email of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+1234567890',
        description: 'Contact phone number of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://facebook.com/spa-page',
        description: 'Facebook page URL of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://zalo.me/spa-page',
        description: 'Zalo URL of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "zalo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://open.kakao.com/spa-page',
        description: 'KakaoTalk URL or ID of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "kakaotalk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://t.me/spa-page',
        description: 'Telegram URL or username of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "telegram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wxid_xxxxxx',
        description: 'WeChat ID of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "wechat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://line.me/spa-page',
        description: 'Line URL or ID of the business',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateWebSettingDto.prototype, "line", void 0);
//# sourceMappingURL=create-web-setting.dto.js.map