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
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new service with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Service created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Req() req, @Body() createServiceDto: CreateServiceDto) {
    // Apply the upload middleware before processing
    return new Promise((resolve, reject) => {
      uploadR2(req, req.res, async (err) => {
        if (err) {
          return reject(err);
        }
        
        try {
          // If file was uploaded, set the coverImage field
          if (req.file && 'location' in req.file) {
            createServiceDto.coverImage = req.file.location;
          }
          
          // Parse any JSON string fields that might have been sent as form data
          if (req.body) {
            Object.keys(req.body).forEach(key => {
              try {
                if (typeof req.body[key] === 'string' && req.body[key].startsWith('{')) {
                  const parsed = JSON.parse(req.body[key]);
                  createServiceDto[key] = parsed;
                }
              } catch (e) {
                // Not JSON, keep as is
              }
            });
          }
          
          const result = await this.servicesService.create(createServiceDto);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Return all services' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('categoryId') categoryId?: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.servicesService.findAll(
      { ...paginationDto, categoryId },
      includeDeleted,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponse({ status: 200, description: 'Return the service' })
  @ApiResponse({ status: 404, description: 'Service not found' })
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
  @ApiOperation({ summary: 'Update a service' })
  @ApiResponse({ status: 200, description: 'Service updated successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a service' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
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
}
