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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { uploadR2 } from '../../common/middlewares/upload-middleware';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new contact with icon upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Req() req, @Body() createContactDto: CreateContactDto) {
    // Apply the upload middleware before processing
    return new Promise((resolve, reject) => {
      uploadR2(req, req.res, async (err) => {
        if (err) {
          return reject(err);
        }
        
        try {
          // If file was uploaded, set the icon field
          if (req.file && 'location' in req.file) {
            createContactDto.icon = req.file.location;
          }
          
          // Parse any JSON string fields that might have been sent as form data
          if (req.body) {
            Object.keys(req.body).forEach(key => {
              try {
                if (typeof req.body[key] === 'string' && req.body[key].startsWith('{')) {
                  const parsed = JSON.parse(req.body[key]);
                  createContactDto[key] = parsed;
                }
              } catch (e) {
                // Not JSON, keep as is
              }
            });
          }
          
          const result = await this.contactsService.create(createContactDto);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, description: 'Return all contacts' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.contactsService.findAll(paginationDto, includeDeleted);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiResponse({ status: 200, description: 'Return the contact' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  findOne(
    @Param('id') id: string,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return this.contactsService.findOne(id, includeDeleted);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a contact' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }

  @Post(':id/restore')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Restore a deleted contact' })
  @ApiResponse({ status: 200, description: 'Contact restored successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  restore(@Param('id') id: string) {
    return this.contactsService.restore(id);
  }
}
