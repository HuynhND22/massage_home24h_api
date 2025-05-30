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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WebSettingsService } from './web-settings.service';
import { CreateWebSettingDto } from './dto/create-web-setting.dto';
import { UpdateWebSettingDto } from './dto/update-web-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('web-settings')
@Controller('web-settings')
export class WebSettingsController {
  constructor(private readonly webSettingsService: WebSettingsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create web settings' })
  @ApiResponse({ status: 201, description: 'Web settings created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createWebSettingDto: CreateWebSettingDto) {
    return this.webSettingsService.create(createWebSettingDto);
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
  @ApiOperation({ summary: 'Update web settings' })
  @ApiResponse({ status: 200, description: 'Web settings updated successfully' })
  @ApiResponse({ status: 404, description: 'Web settings not found' })
  update(
    @Param('id') id: string,
    @Body() updateWebSettingDto: UpdateWebSettingDto,
  ) {
    return this.webSettingsService.update(id, updateWebSettingDto);
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
