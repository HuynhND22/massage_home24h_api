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
  Put,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateServiceDetailDto } from './dto/create-service-detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service-detail.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { ServicePaginationDto } from './dto/service-pagination.dto';
import { Service } from './entities/service.entity';
import { ServiceDetail } from './entities/service-detail.entity';

@ApiTags('services')
@Controller('services')
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createServiceDto: CreateServiceDto) {
    const service = await this.servicesService.create(createServiceDto);
    throw new HttpException({
      statusCode: HttpStatus.CREATED,
      message: 'Service created successfully',
      data: service,
    }, HttpStatus.CREATED);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Return all services' })
  @ApiResponse({ status: 204, description: 'No services found' })
  async findAll(
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
  @ApiResponse({ status: 204, description: 'No deleted services found' })
  async findDeleted(@Query() paginationDto: ServicePaginationDto) {
    const { page, limit, categoryId } = paginationDto;
    return this.servicesService.findDeleted(page, limit, categoryId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Return service' })
  @ApiResponse({ status: 204, description: 'Service not found' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.servicesService.findOne(id, includeDeleted);
  }

  @Get('details/:slug')
  @Public()
  @ApiOperation({ summary: 'Get service details by slug' })
  @ApiResponse({ status: 200, description: 'Return service details' })
  @ApiResponse({ status: 204, description: 'Service not found' })
  async getServiceDetailsBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 204, description: 'Service not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 204, description: 'Service not found' })
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted service' })
  @ApiResponse({ status: 200, description: 'Service restored successfully' })
  @ApiResponse({ status: 204, description: 'Service not found' })
  @ApiResponse({ status: 400, description: 'Service is not deleted' })
  async restore(@Param('id') id: string) {
    return this.servicesService.restore(id);
  }

  @Post('details')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new service detail' })
  @ApiResponse({ status: 201, description: 'Service detail created successfully', type: ServiceDetail })
  @ApiResponse({ status: 204, description: 'Service not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createServiceDetail(@Body() createServiceDetailDto: CreateServiceDetailDto) {
    const serviceDetail = await this.servicesService.createServiceDetail(createServiceDetailDto);
    throw new HttpException({
      statusCode: HttpStatus.CREATED,
      message: 'Service detail created successfully',
      data: serviceDetail,
    }, HttpStatus.CREATED);
  }

  @ApiOperation({ summary: 'Cập nhật chi tiết dịch vụ' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID của chi tiết dịch vụ cần cập nhật',
    type: String
  })
  @ApiBody({
    type: UpdateServiceDetailDto,
    description: 'Dữ liệu cập nhật cho chi tiết dịch vụ'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: ServiceDetail 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ hoặc trùng ngôn ngữ' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy chi tiết dịch vụ hoặc dịch vụ' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Chưa đăng nhập' 
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('details/:id')
  updateServiceDetail(
    @Param('id') id: string,
    @Body() updateServiceDetailDto: UpdateServiceDetailDto
  ) {
    return this.servicesService.updateServiceDetail(id, updateServiceDetailDto);
  }
}
