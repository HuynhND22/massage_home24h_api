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
import { uploadR2 } from '../../common/middlewares/upload-middleware';

@ApiTags('slides')
@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new slide with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Slide created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Req() req): Promise<any> {
    return new Promise((resolve, reject) => {
      // Áp dụng middleware upload cho request hiện tại
      uploadR2(req, req.res, async (err) => {
        if (err) {
          console.error('Upload middleware error:', err);
          return reject(err);
        }
        
        try {
          // Log dữ liệu nhận được để debug
          console.log('Form data received:', req.body);
          
          // Tạo object slide mới từ form data
          const slideData: any = {};
          
          // Gán các trường dữ liệu từ form
          slideData.title = req.body.title;
          slideData.description = req.body.description;
          slideData.role = req.body.role;
          
          // Xử lý trường số
          slideData.order = req.body.order ? parseInt(req.body.order) : undefined;
          
          // Nếu có file upload, gán đường dẫn ảnh
          if (req.file && req.file.location) {
            slideData.image = req.file.location;
          }
          
          // Log dữ liệu sau khi xử lý
          console.log('Slide data after processing:', slideData);
          
          // Kiểm tra dữ liệu thủ công
          if (!slideData.title) {
            return reject({
              message: 'Title is required',
              statusCode: 400
            });
          }
          
          if (!slideData.image) {
            return reject({
              message: 'Image is required',
              statusCode: 400
            });
          }
          
          if (!slideData.role) {
            return reject({
              message: 'Role is required',
              statusCode: 400
            });
          }
          
          // Tạo slide trong database
          const created = await this.slidesService.create(slideData);
          console.log('Slide created successfully:', created);
          resolve(created);
        } catch (error) {
          console.error('Error creating slide:', error);
          reject(error);
        }
      });
    });
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
