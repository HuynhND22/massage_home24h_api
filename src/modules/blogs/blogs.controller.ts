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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateBlogTranslationDto } from './dto/create-blog-translation.dto';
import { UpdateBlogTranslationDto } from './dto/update-blog-translation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { uploadR2 } from '../../common/middlewares/upload-middleware';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new blog with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
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
          
          // Tạo object blog mới từ form data
          const blogData: any = {};
          
          // Gán các trường dữ liệu từ form
          blogData.title = req.body.title;
          blogData.content = req.body.content;
          blogData.excerpt = req.body.excerpt;
          blogData.categoryId = req.body.categoryId;
          blogData.slug = req.body.slug;
          
          // Nếu có file upload, gán đường dẫn ảnh
          if (req.file && req.file.location) {
            blogData.coverImage = req.file.location;
          }
          
          // Log dữ liệu sau khi xử lý
          console.log('Blog data after processing:', blogData);
          
          // Kiểm tra dữ liệu thủ công
          if (!blogData.title) {
            return reject({
              message: 'Title is required',
              statusCode: 400
            });
          }
          
          if (!blogData.categoryId) {
            return reject({
              message: 'Category ID is required',
              statusCode: 400
            });
          }
          
          // Tạo blog trong database
          const created = await this.blogsService.create(blogData);
          console.log('Blog created successfully:', created);
          resolve(created);
        } catch (error) {
          console.error('Error creating blog:', error);
          reject(error);
        }
      });
    });
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({ status: 200, description: 'Return all blog posts' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('categoryId') categoryId?: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.blogsService.findAll(
      { ...paginationDto, categoryId },
      includeDeleted,
    );
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get a blog post by slug' })
  @ApiResponse({ status: 200, description: 'Return the blog post' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiResponse({ status: 200, description: 'Return the blog post' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.blogsService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted blog post' })
  @ApiResponse({ status: 200, description: 'Blog post restored successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  restore(@Param('id') id: string) {
    return this.blogsService.restore(id);
  }

  // Blog Translation endpoints
  @Post('translations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new blog translation' })
  @ApiResponse({ status: 201, description: 'Blog translation created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  createTranslation(@Body() createTranslationDto: CreateBlogTranslationDto) {
    return this.blogsService.createTranslation(createTranslationDto);
  }

  @Get('translations/:id')
  @Public()
  @ApiOperation({ summary: 'Get a blog translation by ID' })
  @ApiResponse({ status: 200, description: 'Return the blog translation' })
  @ApiResponse({ status: 404, description: 'Blog translation not found' })
  findTranslation(@Param('id') id: string) {
    return this.blogsService.findTranslation(id);
  }

  @Patch('translations/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a blog translation' })
  @ApiResponse({ status: 200, description: 'Blog translation updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog translation not found' })
  updateTranslation(
    @Param('id') id: string,
    @Body() updateTranslationDto: UpdateBlogTranslationDto,
  ) {
    return this.blogsService.updateTranslation(id, updateTranslationDto);
  }

  @Delete('translations/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a blog translation' })
  @ApiResponse({ status: 200, description: 'Blog translation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog translation not found' })
  removeTranslation(@Param('id') id: string) {
    return this.blogsService.removeTranslation(id);
  }

  @Post('translations/:id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted blog translation' })
  @ApiResponse({ status: 200, description: 'Blog translation restored successfully' })
  @ApiResponse({ status: 404, description: 'Blog translation not found' })
  restoreTranslation(@Param('id') id: string) {
    return this.blogsService.restoreTranslation(id);
  }
}
