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
import { PaginationDto } from '../../common/dto/pagination.dto';

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
  create(@Body() createServiceDto: CreateServiceDto): Promise<any> {
    console.log('Create service request received:', createServiceDto);
    
    try {
      // Thực hiện validate thủ công các trường cần thiết
      const errors: string[] = [];
      
      if (!createServiceDto.name) errors.push('Name is required');
      if (!createServiceDto.duration || createServiceDto.duration <= 0) errors.push('Duration must be a positive number');
      if (!createServiceDto.price || createServiceDto.price <= 0) errors.push('Price must be a positive number');
      if (!createServiceDto.categoryId) errors.push('Category ID is required');
      
      if (errors.length > 0) {
        console.log('Validation errors:', errors);
        throw new HttpException({
          message: errors,
          statusCode: HttpStatus.BAD_REQUEST
        }, HttpStatus.BAD_REQUEST);
      }
      
      // coverImage giờ đây sẽ là URL được frontend gửi lên sau khi upload thành công
      console.log('Processing service with data:', {
        name: createServiceDto.name,
        description: createServiceDto.description?.substring(0, 30) + '...',
        duration: createServiceDto.duration,
        price: createServiceDto.price,
        coverImage: createServiceDto.coverImage || 'No image provided'
      });
      
      // Gọi service để tạo record mới
      return this.servicesService.create(createServiceDto);
    } catch (error) {
      console.error('Error in create service:', error);
      throw error;
    }
  }

  @Get()
  @Public()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('categoryId') categoryId?: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.servicesService.findAll({ ...paginationDto, categoryId }, includeDeleted);
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
  restore(@Param('id') id: string) {
    return this.servicesService.restore(id);
  }
}
