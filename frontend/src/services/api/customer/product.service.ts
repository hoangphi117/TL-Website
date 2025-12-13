import axiosClient from "@/services/api/customer/axiosClient";
import { type IProductListResponse } from "@/types/product";

interface IProductFilterParams {
  category?: string;
  brand?: string;
  keyword?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  getProducts: async (
    params: IProductFilterParams
  ): Promise<IProductListResponse> => {
    // Gọi API: GET /products
    // Generic <any, IProductListResponse>: axiosClient sẽ trả về đúng type response này
    return axiosClient.get<any, IProductListResponse>("/products", {
      params: params,
    });
  },

  getProductById: async (id: string) => {
    return axiosClient.get(`/products/${id}`);
  },
};
