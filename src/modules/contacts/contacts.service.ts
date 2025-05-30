import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactsRepository.create(createContactDto);
    return this.contactsRepository.save(contact);
  }

  async findAll(
    params: PaginationParams,
    includeDeleted: boolean = false,
  ): Promise<PaginatedResponse<Contact>> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = 'order', 
      sortOrder = 'ASC',
    } = params;
    
    const queryBuilder = this.contactsRepository.createQueryBuilder('contact');
    
    if (includeDeleted) {
      queryBuilder.withDeleted();
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(contact.name ILIKE :search OR contact.value ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    
    const totalItems = await queryBuilder.getCount();
    
    queryBuilder
      .orderBy(`contact.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    
    const items = await queryBuilder.getMany();
    
    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string, includeDeleted: boolean = false): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({
      where: { id },
      withDeleted: includeDeleted,
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    
    Object.assign(contact, updateContactDto);
    return this.contactsRepository.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactsRepository.softDelete(id);
  }

  async restore(id: string): Promise<Contact> {
    const contact = await this.findOne(id, true);
    
    if (!contact.deletedAt) {
      throw new Error('Contact is not deleted');
    }
    
    await this.contactsRepository.restore(id);
    return this.findOne(id);
  }
}
