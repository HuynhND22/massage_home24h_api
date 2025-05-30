import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    CommonModule,
  ],
  controllers: [UploadController],
})
export class UploadModule {}
