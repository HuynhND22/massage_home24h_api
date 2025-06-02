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
  Req,
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
import { uploadR2 } from '../../common/middlewares/upload-middleware';

@ApiTags('web-settings')
@Controller('web-settings')
export class WebSettingsController {
  constructor(private readonly webSettingsService: WebSettingsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create web settings with logo upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Web settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Req() req, @Body() createWebSettingDto: CreateWebSettingDto) {
    // Apply the upload middleware before processing
    return new Promise((resolve, reject) => {
      uploadR2(req, req.res, async (err) => {
        if (err) {
          return reject(err);
        }
        
        try {
          // If file was uploaded, set the logo field
          if (req.file && 'location' in req.file) {
            createWebSettingDto.logo = req.file.location;
          }
          
          // Parse any JSON string fields that might have been sent as form data
          if (req.body) {
            Object.keys(req.body).forEach(key => {
              try {
                if (typeof req.body[key] === 'string' && req.body[key].startsWith('{')) {
                  const parsed = JSON.parse(req.body[key]);
                  createWebSettingDto[key] = parsed;
                }
              } catch (e) {
                // Not JSON, keep as is
              }
            });
          }
          
          const result = await this.webSettingsService.create(createWebSettingDto);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
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
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateWebSettingDto: UpdateWebSettingDto,
  ) {
    // Apply the upload middleware before processing
    return new Promise((resolve, reject) => {
      uploadR2(req, req.res, async (err) => {
        if (err) {
          return reject(err);
        }
        
        try {
          // If file was uploaded, set the logo field
          if (req.file && 'location' in req.file) {
            updateWebSettingDto.logo = req.file.location;
          }
          
          // Parse any JSON string fields that might have been sent as form data
          if (req.body) {
            Object.keys(req.body).forEach(key => {
              try {
                if (typeof req.body[key] === 'string' && req.body[key].startsWith('{')) {
                  const parsed = JSON.parse(req.body[key]);
                  updateWebSettingDto[key] = parsed;
                }
              } catch (e) {
                // Not JSON, keep as is
              }
            });
          }
          
          const result = await this.webSettingsService.update(id, updateWebSettingDto);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
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
