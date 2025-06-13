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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2StorageService } from '../../common/services/r2-storage.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly r2StorageService: R2StorageService
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new contact with icon upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UseInterceptors(FileInterceptor('icon'))
  async create(
    @Body() createContactDto: CreateContactDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    try {
      // If file was uploaded, upload to R2 and set the icon field
      if (file) {
        const fileUrl = await this.r2StorageService.uploadFile(file, 'contacts');
        createContactDto.icon = fileUrl;
        console.log('Icon uploaded to R2:', fileUrl);
      }
      
      // Parse any JSON string fields that might have been sent as form data
      if (createContactDto) {
        Object.keys(createContactDto).forEach(key => {
          try {
            if (typeof createContactDto[key] === 'string' && createContactDto[key].startsWith('{')) {
              const parsed = JSON.parse(createContactDto[key]);
              createContactDto[key] = parsed;
            }
          } catch (e) {
            // Not JSON, keep as is
          }
        });
      }
      
      const contact = await this.contactsService.create(createContactDto);
      throw new HttpException({
        statusCode: HttpStatus.CREATED,
        message: 'Contact created successfully',
        data: contact,
      }, HttpStatus.CREATED);
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, description: 'Return all contacts' })
  @ApiResponse({ status: 204, description: 'No contacts found' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.contactsService.findAll(paginationDto, includeDeleted);
  }

  @Get('deleted')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all soft-deleted contacts' })
  @ApiResponse({ status: 200, description: 'Return all soft-deleted contacts' })
  @ApiResponse({ status: 204, description: 'No deleted contacts found' })
  async findDeleted(@Query() paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    return this.contactsService.findAll({ page, limit }, true);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiResponse({ status: 200, description: 'Return the contact' })
  @ApiResponse({ status: 204, description: 'Contact not found' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.contactsService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update contact' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 204, description: 'Contact not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 204, description: 'Contact not found' })
  async remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted contact' })
  @ApiResponse({ status: 200, description: 'Contact restored successfully' })
  @ApiResponse({ status: 204, description: 'Contact not found' })
  @ApiResponse({ status: 400, description: 'Contact is not deleted' })
  async restore(@Param('id') id: string) {
    return this.contactsService.restore(id);
  }
}
