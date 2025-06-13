// src/services/services.controller.ts
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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { ServicePaginationDto } from './dto/service-pagination.dto';

@ApiTags('services')
@Controller('services')
@UseInterceptors(LoggingInterceptor)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Return all services' })
  findAll(
    @Query() paginationDto: ServicePaginationDto,
  ) {
    const { includeDeleted, ...paginationParams } = paginationDto;
    return this.servicesService.findAll(paginationParams, includeDeleted);
  }

  @Get('deleted')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all soft-deleted services' })
  @ApiResponse({ status: 200, description: 'Return all soft-deleted services' })
  findDeleted(@Query() paginationDto: ServicePaginationDto) {
    const { page, limit, categoryId } = paginationDto;
    return this.servicesService.findDeleted(page, limit, categoryId);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.servicesService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted service' })
  @ApiResponse({ status: 200, description: 'Service restored successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  restore(@Param('id') id: string) {
    return this.servicesService.restore(id);
  }

  @Get('details/:slug')
  @Public()
  @ApiOperation({ summary: 'Get service details by slug' })
  @ApiResponse({ status: 200, description: 'Return service details' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async getServiceDetailsBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }
}
