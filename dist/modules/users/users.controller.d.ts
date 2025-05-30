import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(includeDeleted: boolean): Promise<import("./entities/user.entity").User[]>;
    getProfile(req: any): Promise<import("./entities/user.entity").User>;
    findOne(id: string, includeDeleted: boolean): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/user.entity").User>;
}
