import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    create(req: any, createContactDto: CreateContactDto): Promise<unknown>;
    findAll(paginationDto: PaginationDto, includeDeleted?: boolean): Promise<import("../../common/interfaces/pagination.interface").PaginatedResponse<import("./entities/contact.entity").Contact>>;
    findOne(id: string, includeDeleted?: boolean): Promise<import("./entities/contact.entity").Contact>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<import("./entities/contact.entity").Contact>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/contact.entity").Contact>;
}
