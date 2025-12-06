import type { IBrand, IBrandListResponse } from '@/types/brand';
import axiosClient from '../anxiosCient';

const brandApi = {
    getAll(): Promise<IBrandListResponse> {
        return axiosClient.get("/admin/brand/getAllBrands");
    },

    update(id: string, data: Partial<IBrand>): Promise<{success: boolean; message: string; data: IBrand}> {
        return axiosClient.put(`/admin/brand/${id}`, data);
    },

    delete(id: string): Promise<{success: boolean; message: string}> {
        return axiosClient.delete(`/admin/brand/${id}`)
    }
}

export default brandApi