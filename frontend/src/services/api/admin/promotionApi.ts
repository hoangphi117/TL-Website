import type { PromotionQuery } from './query'
import axiosClient from './axiosClient';
import type { IPromotion, IPromotionListResponse } from '@/types/promotion'

const promotionApi = {
    getAll(params?: PromotionQuery) {
        return axiosClient.get<IPromotionListResponse>('admin/promotion/getAllPromotions', {params});
    },

    getById(id: string) {
        return axiosClient.get<{success: boolean; data: IPromotion}>(`admin/promotion/${id}`);
    },
}

export default promotionApi;