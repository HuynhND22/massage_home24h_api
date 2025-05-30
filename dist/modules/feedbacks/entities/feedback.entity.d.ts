import { BaseEntity } from '../../../common/entities/base.entity';
export declare class Feedback extends BaseEntity {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    serviceDate: Date;
    isRead: boolean;
}
