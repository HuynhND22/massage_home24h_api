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
  Req,
  UseInterceptors
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
import { uploadR2 } from '../../common/middlewares/upload-middleware';

@ApiTags('services')
@Controller('services')
@UseInterceptors(LoggingInterceptor)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBearerAuth()
  @Public() // Thêm decorator Public để bỏ qua JwtAuthGuard khi test
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new service with image upload to R2' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Req() req): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('----------------------------------------');
      console.log('RECEIVED REQUEST - BEFORE UPLOAD MIDDLEWARE');
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Body (keys):', Object.keys(req.body));
      console.log('Body (raw):', req.body);
      console.log('----------------------------------------');

      // Áp dụng middleware uploadR2
      uploadR2(req, req.res, async (err) => {
        if (err) {
          console.error('UPLOAD MIDDLEWARE ERROR:', err);
          return reject({
            message: 'Lỗi khi xử lý tập tin: ' + err.message,
            statusCode: 400
          });
        }
        
        try {
          console.log('----------------------------------------');
          console.log('AFTER UPLOAD MIDDLEWARE');
          console.log('Body (keys):', Object.keys(req.body));
          console.log('Body values:', req.body);
          console.log('File:', req.file ? `${req.file.originalname} (${req.file.mimetype})` : 'No file');
          console.log('----------------------------------------');
          
          // Tạo service mới từ form data
          const serviceData: any = {};
          
          // Gán các trường cơ bản
          serviceData.name = req.body.name;
          serviceData.description = req.body.description;
          
          // Xử lý kiểu dữ liệu cho các trường số
          if (req.body.duration) {
            const durationNum = parseFloat(req.body.duration);
            serviceData.duration = isNaN(durationNum) ? 0 : durationNum;
          }
          
          if (req.body.price) {
            const priceNum = parseFloat(req.body.price);
            serviceData.price = isNaN(priceNum) ? 0 : priceNum;
          }
          
          if (req.body.discount) {
            const discountNum = parseFloat(req.body.discount);
            serviceData.discount = isNaN(discountNum) ? 0 : discountNum;
          }
          
          // Gán categoryId
          serviceData.categoryId = req.body.categoryId;
          
          // Gán đường dẫn ảnh nếu có
          if (req.file && req.file.location) {
            serviceData.coverImage = req.file.location;
            console.log('File uploaded to:', req.file.location);
          }
          
          // Hiển thị dữ liệu đã xử lý
          console.log('SERVICE DATA TO BE CREATED:', serviceData);
          
          // Kiểm tra các trường bắt buộc
          const errors: string[] = [];
          
          if (!serviceData.name) errors.push('Name is required');
          if (!serviceData.duration || serviceData.duration <= 0) errors.push('Duration must be a positive number');
          if (!serviceData.price || serviceData.price <= 0) errors.push('Price must be a positive number');
          if (!serviceData.categoryId) errors.push('Category ID is required');
          
          if (errors.length > 0) {
            console.log('VALIDATION ERRORS:', errors);
            return reject({
              message: errors,
              statusCode: 400
            });
          }
          
          // Gọi service để tạo record mới
          console.log('CREATING NEW SERVICE...');
          const created = await this.servicesService.create(serviceData);
          console.log('SERVICE CREATED SUCCESSFULLY:', created.id);
          resolve(created);
        } catch (error) {
          console.error('Error creating service:', error);
          reject(error);
        }
      });
    });
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
