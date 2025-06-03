import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { WebSettingsService } from './web-settings.service';
import { CreateWebSettingDto } from './dto/create-web-setting.dto';
import { UpdateWebSettingDto } from './dto/update-web-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2StorageService } from '../../common/services/r2-storage.service';

@ApiTags('web-settings')
@Controller('web-settings')
export class WebSettingsController {
  constructor(
    private readonly webSettingsService: WebSettingsService,
    private readonly r2StorageService: R2StorageService
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create web settings with logo upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Web settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createWebSettingDto: CreateWebSettingDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // If file was uploaded, upload to R2 and set the logo field
      if (file) {
        const fileUrl = await this.r2StorageService.uploadFile(file, 'settings');
        createWebSettingDto.logo = fileUrl;
        console.log('Logo uploaded to R2:', fileUrl);
      }
      
      // Parse any JSON string fields that might have been sent as form data
      if (createWebSettingDto) {
        Object.keys(createWebSettingDto).forEach(key => {
          try {
            if (typeof createWebSettingDto[key] === 'string' && createWebSettingDto[key].startsWith('{')) {
              const parsed = JSON.parse(createWebSettingDto[key]);
              createWebSettingDto[key] = parsed;
            }
          } catch (e) {
            // Not JSON, keep as is
          }
        });
      }
      
      const result = await this.webSettingsService.create(createWebSettingDto);
      return result;
    } catch (error) {
      console.error('Error creating web settings:', error);
      throw error;
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get web settings' })
  @ApiResponse({ status: 200, description: 'Return web settings' })
  @ApiResponse({ status: 404, description: 'Web settings not found' })
  findOne(@Query('includeDeleted') includeDeleted?: boolean) {
    return this.webSettingsService.findOne(includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update web settings with logo upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Web settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Web settings not found' })
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() updateWebSettingDto: UpdateWebSettingDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // If file was uploaded, upload to R2 and set the logo field
      if (file) {
        const fileUrl = await this.r2StorageService.uploadFile(file, 'settings');
        updateWebSettingDto.logo = fileUrl;
        console.log('Logo uploaded to R2:', fileUrl);
      }
      
      // Parse any JSON string fields that might have been sent as form data
      if (updateWebSettingDto) {
        Object.keys(updateWebSettingDto).forEach(key => {
          try {
            if (typeof updateWebSettingDto[key] === 'string' && updateWebSettingDto[key].startsWith('{')) {
              const parsed = JSON.parse(updateWebSettingDto[key]);
              updateWebSettingDto[key] = parsed;
            }
          } catch (e) {
            // Not JSON, keep as is
          }
        });
      }
      
      const result = await this.webSettingsService.update(id, updateWebSettingDto);
      return result;
    } catch (error) {
      console.error('Error updating web settings:', error);
      throw error;
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete web settings' })
  @ApiResponse({ status: 200, description: 'Web settings deleted successfully' })
  @ApiResponse({ status: 404, description: 'Web settings not found' })
  remove(@Param('id') id: string) {
    return this.webSettingsService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore deleted web settings' })
  @ApiResponse({ status: 200, description: 'Web settings restored successfully' })
  @ApiResponse({ status: 404, description: 'Web settings not found' })
  restore(@Param('id') id: string) {
    return this.webSettingsService.restore(id);
  }
}
