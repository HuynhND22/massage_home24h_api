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
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SlideRole } from './entities/slide.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2StorageService } from '../../common/services/r2-storage.service';

@ApiTags('slides')
@Controller('slides')
export class SlidesController {
  constructor(
    private readonly slidesService: SlidesService,
    private readonly r2StorageService: R2StorageService
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new slide with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Slide created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createSlideDto: CreateSlideDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // Log dữ liệu nhận được để debug
      console.log('Form data received:', createSlideDto);
      
      // Tạo object slide mới từ form data
      const slideData: any = { ...createSlideDto };
      
      // Xử lý trường số
      slideData.order = slideData.order ? parseInt(slideData.order.toString()) : undefined;
      
      // Nếu có file upload, upload lên R2 và gán đường dẫn ảnh
      if (file) {
        const fileUrl = await this.r2StorageService.uploadFile(file, 'slides');
        slideData.image = fileUrl;
        console.log('File uploaded to R2:', fileUrl);
      }
      
      // Log dữ liệu sau khi xử lý
      console.log('Slide data after processing:', slideData);
      
      // Kiểm tra dữ liệu thủ công
      if (!slideData.title) {
        throw new Error('Title is required');
      }
      
      if (!slideData.image) {
        throw new Error('Image is required');
      }
      
      if (!slideData.role) {
        throw new Error('Role is required');
      }
      
      // Tạo slide trong database
      const created = await this.slidesService.create(slideData);
      console.log('Slide created successfully:', created);
      return created;
    } catch (error) {
      console.error('Error creating slide:', error);
      throw error;
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all slides' })
  @ApiResponse({ status: 200, description: 'Return all slides' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('role') role?: SlideRole,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.slidesService.findAll(
      { ...paginationDto, role },
      includeDeleted,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a slide by ID' })
  @ApiResponse({ status: 200, description: 'Return the slide' })
  @ApiResponse({ status: 404, description: 'Slide not found' })
  findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.slidesService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a slide' })
  @ApiResponse({ status: 200, description: 'Slide updated successfully' })
  @ApiResponse({ status: 404, description: 'Slide not found' })
  update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slidesService.update(id, updateSlideDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a slide' })
  @ApiResponse({ status: 200, description: 'Slide deleted successfully' })
  @ApiResponse({ status: 404, description: 'Slide not found' })
  remove(@Param('id') id: string) {
    return this.slidesService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted slide' })
  @ApiResponse({ status: 200, description: 'Slide restored successfully' })
  @ApiResponse({ status: 404, description: 'Slide not found' })
  restore(@Param('id') id: string) {
    return this.slidesService.restore(id);
  }
}
