import type { IReview, IReviewListResponse } from "@/types/review"
import axiosClient from "./axiosClient"
import type { IReviewQuery } from "./query"

const reviewApi = {
    getAll(params?: IReviewQuery) {
        return axiosClient.get<IReviewListResponse>("admin/review", {params});
    },

    adminReply(id: string, adminReply: string) {
        return axiosClient.put<{success: boolean, message: string, data: IReview}>(`admin/review/${id}/reply`, {adminReply});
    },

    approveReview(id: string) {
        return axiosClient.put<{success: boolean, message: string, data: IReview}>(`admin/review/${id}/approve`);
    },

    rejectReview(id: string, reason: string) {
        return axiosClient.put<{success: boolean, message: string, data: IReview}>(`admin/review/${id}/reject`, {reason});
    },

    delete(id: string) {
        return axiosClient.delete<{success: boolean, message: string}>(`admin/review/${id}`);
    },
}

export default reviewApi