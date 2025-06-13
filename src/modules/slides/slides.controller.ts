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
  HttpException,
  HttpStatus,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { R2StorageService } from '../../common/services/r2-storage.service';

@ApiTags('slides')
@Controller('slides')
export class SlidesController {
  constructor(
    private readonly slidesService: SlidesService,
    private readonly r2StorageService: R2StorageService,
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
      // If file was uploaded, upload to R2 and set the image field
      if (file) {
        const fileUrl = await this.r2StorageService.uploadFile(file, 'slides');
        createSlideDto.image = fileUrl;
        console.log('Image uploaded to R2:', fileUrl);
      }
      
      // Parse any JSON string fields that might have been sent as form data
      if (createSlideDto) {
        Object.keys(createSlideDto).forEach(key => {
          try {
            if (typeof createSlideDto[key] === 'string' && createSlideDto[key].startsWith('{')) {
              const parsed = JSON.parse(createSlideDto[key]);
              createSlideDto[key] = parsed;
            }
          } catch (e) {
            // Not JSON, keep as is
          }
        });
      }
      
      const slide = await this.slidesService.create(createSlideDto);
      throw new HttpException({
        statusCode: HttpStatus.CREATED,
        message: 'Slide created successfully',
        data: slide,
      }, HttpStatus.CREATED);
    } catch (error) {
      console.error('Error creating slide:', error);
      throw error;
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all slides' })
  @ApiResponse({ status: 200, description: 'Return all slides' })
  @ApiResponse({ status: 204, description: 'No slides found' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.slidesService.findAll(paginationDto, includeDeleted);
  }

  @Get('deleted')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all soft-deleted slides' })
  @ApiResponse({ status: 200, description: 'Return all soft-deleted slides' })
  @ApiResponse({ status: 204, description: 'No deleted slides found' })
  async findDeleted(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.slidesService.findAll({ page, limit }, true);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a slide by ID' })
  @ApiResponse({ status: 200, description: 'Return the slide' })
  @ApiResponse({ status: 204, description: 'Slide not found' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.slidesService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update slide' })
  @ApiResponse({ status: 200, description: 'Slide updated successfully' })
  @ApiResponse({ status: 204, description: 'Slide not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(@Param('id') id: string, @Body() updateSlideDto: UpdateSlideDto) {
    return this.slidesService.update(id, updateSlideDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete slide' })
  @ApiResponse({ status: 200, description: 'Slide deleted successfully' })
  @ApiResponse({ status: 204, description: 'Slide not found' })
  async remove(@Param('id') id: string) {
    return this.slidesService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted slide' })
  @ApiResponse({ status: 200, description: 'Slide restored successfully' })
  @ApiResponse({ status: 204, description: 'Slide not found' })
  @ApiResponse({ status: 400, description: 'Slide is not deleted' })
  async restore(@Param('id') id: string) {
    return this.slidesService.restore(id);
  }
}
