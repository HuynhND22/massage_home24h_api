import { R2StorageService } from '../../common/services/r2-storage.service';
export declare class UploadController {
    private readonly r2StorageService;
    constructor(r2StorageService: R2StorageService);
    uploadFile(file: Express.Multer.File, folder?: string, preserveFilename?: boolean): Promise<{
        url: string;
    }>;
    deleteFile(fileUrl: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
