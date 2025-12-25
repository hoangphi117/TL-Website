import type { PromotionQuery } from './query'
import axiosClient from './axiosClient';
import type { IPromotion, IPromotionListResponse, IPromotionUpdate } from '@/types/promotion'

const promotionApi = {
    getAll(params?: PromotionQuery) {
        return axiosClient.get<IPromotionListResponse>('admin/promotion/getAllPromotions', {params});
    },

    getById(id: string) {
        return axiosClient.get<{success: boolean; data: IPromotion}>(`admin/promotion/${id}`);
    },

    update(id: string, data: IPromotionUpdate) {
        return axiosClient.put<{success: boolean; data: IPromotion }>(`admin/promotion/${id}`, data);
    }
}

export default promotionApi;