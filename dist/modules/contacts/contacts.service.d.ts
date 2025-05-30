import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';
export declare class ContactsService {
    private contactsRepository;
    constructor(contactsRepository: Repository<Contact>);
    create(createContactDto: CreateContactDto): Promise<Contact>;
    findAll(params: PaginationParams, includeDeleted?: boolean): Promise<PaginatedResponse<Contact>>;
    findOne(id: string, includeDeleted?: boolean): Promise<Contact>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<Contact>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<Contact>;
}
