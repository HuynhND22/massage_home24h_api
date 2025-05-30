export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
}
