export interface IReviewUser {
  _id: string;
  fullName: string;
  email: string;
}

export interface IReviewProduct {
  _id: string;
  name: string;
  images: string[];
}

export interface IReview {
    _id: string;
    productId: IReviewProduct;
    userId: IReviewUser;
    rating: number;
    comment?: string;
    images: string[];
    status: "pending" | "approved" | "rejected";
    adminReply: string | "";
    createdAt: string;
}

export interface IReviewListResponse {
    success: boolean;
    total: number;
    page: number;
    pages: number;
    data: IReview[];
}
