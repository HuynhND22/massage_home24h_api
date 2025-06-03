import { ConfigService } from '@nestjs/config';
export declare class R2StorageService {
    private configService;
    private s3Client;
    private bucketName;
    private publicUrl;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder?: string, preserveFilename?: boolean): Promise<string>;
    deleteFile(fileUrl: string): Promise<boolean>;
    generatePresignedUrl(key: string, expiresIn?: number): Promise<string>;
}
