import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebSettingsService } from './web-settings.service';
import { WebSettingsController } from './web-settings.controller';
import { WebSetting } from './entities/web-setting.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([WebSetting]), CommonModule],
  controllers: [WebSettingsController],
  providers: [WebSettingsService],
  exports: [WebSettingsService],
})
export class WebSettingsModule {}
