import { BaseEntity } from '../../../common/entities/base.entity';
export declare enum UserRole {
    ADMIN = "admin",
    STAFF = "staff"
}
export declare class User extends BaseEntity {
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: UserRole;
    isActive: boolean;
}
