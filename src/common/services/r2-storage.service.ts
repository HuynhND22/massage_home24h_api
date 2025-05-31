import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class R2StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('r2.accountId') || '';
    const accessKeyId = this.configService.get<string>('r2.accessKeyId') || '';
    const secretAccessKey = this.configService.get<string>('r2.secretAccessKey') || '';
    
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = this.configService.get<string>('r2.bucketName') || 'spa-assets';
    this.publicUrl = this.configService.get<string>('r2.publicUrl') || 'https://example.com/assets';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    preserveFilename: boolean = true,
  ): Promise<string> {
    let fileName: string;
    if (preserveFilename) {
      // Get original filename and extension
      const originalName = file.originalname.split('.').slice(0, -1).join('.');
      const fileExtension = file.originalname.split('.').pop();
      // Create a sanitized filename: replace spaces and special characters
      const sanitizedName = originalName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      // Add a timestamp to prevent duplicates
      const timestamp = new Date().getTime();
      fileName = `${folder}/${sanitizedName}-${timestamp}.${fileExtension}`;
    } else {
      // Use UUID method (original implementation)
      const fileExtension = file.originalname.split('.').pop();
      fileName = `${folder}/${uuidv4()}.${fileExtension}`;
    }

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${this.publicUrl}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Handle both full URLs and direct file paths
      let fileName = fileUrl;
      if (fileUrl.startsWith(this.publicUrl)) {
        fileName = fileUrl.replace(`${this.publicUrl}/`, '');
      }

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting file from R2:', error);
      return false;
    }
  }

  async generatePresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
