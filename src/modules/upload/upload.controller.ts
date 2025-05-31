import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { R2StorageService } from '../../common/services/r2-storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly r2StorageService: R2StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: string = 'uploads',
    @Query('preserveFilename') preserveFilename: boolean = true,
  ) {
    const fileUrl = await this.r2StorageService.uploadFile(file, folder, preserveFilename);
    return { url: fileUrl };
  }

  @Delete()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileUrl: {
          type: 'string',
          description: 'The URL or path of the file to delete',
        },
      },
      required: ['fileUrl'],
    },
  })
  async deleteFile(@Body('fileUrl') fileUrl: string) {
    if (!fileUrl) {
      throw new HttpException('fileUrl is required', HttpStatus.BAD_REQUEST);
    }
    
    const result = await this.r2StorageService.deleteFile(fileUrl);
    
    if (result) {
      return {
        success: true,
        message: 'File deleted successfully'
      };
    } else {
      throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
