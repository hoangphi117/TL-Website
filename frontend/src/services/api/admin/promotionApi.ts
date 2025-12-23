import type { PromotionQuery } from './query'
import axiosClient from './axiosClient';
import type { IPromotionListResponse } from '@/types/promotion'

const promotionApi = {
    getAll(params?: PromotionQuery) {
        return axiosClient.get<IPromotionListResponse>('admin/promotion/getAllPromotions', {params});
    }
}

export default promotionApi;