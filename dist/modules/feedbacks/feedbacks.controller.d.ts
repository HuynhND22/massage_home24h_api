import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FeedbacksController {
    private readonly feedbacksService;
    constructor(feedbacksService: FeedbacksService);
    create(createFeedbackDto: CreateFeedbackDto): Promise<import("./entities/feedback.entity").Feedback>;
    findAll(paginationDto: PaginationDto, isRead?: boolean, includeDeleted?: boolean): Promise<import("../../common/interfaces/pagination.interface").PaginatedResponse<import("./entities/feedback.entity").Feedback>>;
    findOne(id: string, includeDeleted?: boolean): Promise<import("./entities/feedback.entity").Feedback>;
    update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<import("./entities/feedback.entity").Feedback>;
    markAsRead(id: string): Promise<import("./entities/feedback.entity").Feedback>;
    remove(id: string): Promise<void>;
    restore(id: string): Promise<import("./entities/feedback.entity").Feedback>;
}
