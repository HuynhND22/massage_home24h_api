import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebSettingsService } from './web-settings.service';
import { WebSettingsController } from './web-settings.controller';
import { WebSetting } from './entities/web-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebSetting])],
  controllers: [WebSettingsController],
  providers: [WebSettingsService],
  exports: [WebSettingsService],
})
export class WebSettingsModule {}
