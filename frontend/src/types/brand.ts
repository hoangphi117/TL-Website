export interface IBrand {
    _id: string;
    name: string;
    logoUrl: string;
    _v?: number;
}

export interface IBrandListResponse {
    success: boolean;
    count: number;
    data: IBrand[];
}