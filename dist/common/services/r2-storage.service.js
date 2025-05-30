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
exports.R2StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
let R2StorageService = class R2StorageService {
    configService;
    s3Client;
    bucketName;
    publicUrl;
    constructor(configService) {
        this.configService = configService;
        const accountId = this.configService.get('r2.accountId') || '';
        const accessKeyId = this.configService.get('r2.accessKeyId') || '';
        const secretAccessKey = this.configService.get('r2.secretAccessKey') || '';
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.bucketName = this.configService.get('r2.bucketName') || 'spa-assets';
        this.publicUrl = this.configService.get('r2.publicUrl') || 'https://example.com/assets';
    }
    async uploadFile(file, folder = 'uploads') {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });
        await this.s3Client.send(command);
        return `${this.publicUrl}/${fileName}`;
    }
    async deleteFile(fileUrl) {
        const fileName = fileUrl.replace(`${this.publicUrl}/`, '');
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
        });
        await this.s3Client.send(command);
    }
    async generatePresignedUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
};
exports.R2StorageService = R2StorageService;
exports.R2StorageService = R2StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], R2StorageService);
//# sourceMappingURL=r2-storage.service.js.map