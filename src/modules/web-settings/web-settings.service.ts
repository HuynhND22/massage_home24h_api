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

  async findOne(includeDeleted: boolean = false): Promise<WebSetting> {
    const webSetting = await this.webSettingsRepository.findOne({
      where: {},
      withDeleted: includeDeleted,
      order: { createdAt: 'DESC' },
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
    try {
      // Tìm web setting kể cả đã bị soft delete
      const webSetting = await this.webSettingsRepository.findOne({
        where: { id },
        withDeleted: true,
      });

      if (!webSetting) {
        throw new NotFoundException(`Web settings with ID ${id} not found`);
      }
      
      console.log('Found web setting:', webSetting);
      console.log('Soft deleting web setting:', id);
      const result = await this.webSettingsRepository.softDelete(id);
      console.log('Web setting delete result:', result);
    } catch (error) {
      console.error('Error in remove method:', error);
      throw error;
    }
  }

  async restore(id: string): Promise<WebSetting> {
    const webSetting = await this.webSettingsRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!webSetting) {
      throw new NotFoundException(`Web settings with ID ${id} not found`);
    }

    if (!webSetting.deletedAt) {
      throw new Error('Web settings are not deleted');
    }
    
    await this.webSettingsRepository.restore(id);
    return this.findOne();
  }
}
