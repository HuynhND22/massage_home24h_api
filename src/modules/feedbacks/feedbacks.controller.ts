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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbacksService.create(createFeedbackDto);
    throw new HttpException({
      statusCode: HttpStatus.CREATED,
      message: 'Feedback created successfully',
      data: feedback,
    }, HttpStatus.CREATED);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiResponse({ status: 200, description: 'Return all feedbacks' })
  @ApiResponse({ status: 204, description: 'No feedbacks found' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.feedbacksService.findAll(paginationDto, includeDeleted);
  }

  @Get('deleted')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all soft-deleted feedbacks' })
  @ApiResponse({ status: 200, description: 'Return all soft-deleted feedbacks' })
  @ApiResponse({ status: 204, description: 'No deleted feedbacks found' })
  async findDeleted(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.feedbacksService.findAll({ page, limit }, true);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a feedback by ID' })
  @ApiResponse({ status: 200, description: 'Return the feedback' })
  @ApiResponse({ status: 204, description: 'Feedback not found' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.feedbacksService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update feedback' })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully' })
  @ApiResponse({ status: 204, description: 'Feedback not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbacksService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully' })
  @ApiResponse({ status: 204, description: 'Feedback not found' })
  async remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted feedback' })
  @ApiResponse({ status: 200, description: 'Feedback restored successfully' })
  @ApiResponse({ status: 204, description: 'Feedback not found' })
  @ApiResponse({ status: 400, description: 'Feedback is not deleted' })
  async restore(@Param('id') id: string) {
    return this.feedbacksService.restore(id);
  }
}
