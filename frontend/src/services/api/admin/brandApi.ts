import type { IBrand, IBrandListResponse } from '@/types/brand';
import axiosClient from '../anxiosCient';

const brandApi = {
    getAll(): Promise<IBrandListResponse> {
        return axiosClient.get("/admin/brand/getAllBrands");
    },
}

export default brandApi