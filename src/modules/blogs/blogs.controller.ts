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

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
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
