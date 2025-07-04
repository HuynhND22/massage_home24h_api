import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebSetting } from './entities/web-setting.entity';
import { CreateWebSettingDto } from './dto/create-web-setting.dto';
import { UpdateWebSettingDto } from './dto/update-web-setting.dto';

@Injectable()
export class WebSettingsService {
  constructor(
    @InjectRepository(WebSetting)
    private webSettingsRepository: Repository<WebSetting>,
  ) {}

  async create(createWebSettingDto: CreateWebSettingDto): Promise<WebSetting> {
    // Check if there's already a web setting (there should be only one)
    const existingSettings = await this.webSettingsRepository.find();
    
    if (existingSettings.length > 0) {
      throw new Error('Web settings already exist. Use update instead.');
    }
    
    const webSetting = this.webSettingsRepository.create(createWebSettingDto);
    return this.webSettingsRepository.save(webSetting);
  }

  async findOne(): Promise<WebSetting> {
    const webSetting = await this.webSettingsRepository.findOne({
      where: {},
    });

    if (!webSetting) {
      throw new NotFoundException('Web settings not found');
    }

    return webSetting;
  }

  async update(id: string, updateWebSettingDto: UpdateWebSettingDto): Promise<WebSetting> {
    const webSetting = await this.webSettingsRepository.findOne({
      where: { id },
    });

    if (!webSetting) {
      throw new NotFoundException(`Web settings with ID ${id} not found`);
    }
    
    Object.assign(webSetting, updateWebSettingDto);
    return this.webSettingsRepository.save(webSetting);
  }

  async remove(id: string): Promise<void> {
    const webSetting = await this.webSettingsRepository.findOne({
      where: { id },
    });

    if (!webSetting) {
      throw new NotFoundException(`Web settings with ID ${id} not found`);
    }
    
    await this.webSettingsRepository.delete(id);
  }
}
