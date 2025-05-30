import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PaginationParams, PaginatedResponse } from '../../common/interfaces/pagination.interface';
export declare class FeedbacksService {
    private feedbacksRepository;
    constructor(feedbacksRepository: Repository<Feedback>);
    create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback>;
    findAll(params: PaginationParams & {
        isRead?: boolean;
    }, includeDeleted?: boolean): Promise<PaginatedResponse<Feedback>>;
    findOne(id: string, includeDeleted?: boolean): Promise<Feedback>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback>;
    markAsRead(id: string): Promise<Feedback>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<Feedback>;
}
