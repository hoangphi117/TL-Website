import type { IOrder, IOrderListResponse } from "@/types/order";
import axiosClient from "./axiosClient";
import type { OrderQuery } from "./query";

const orderApi = {
  getAll(params?: OrderQuery) {
    return axiosClient.get<IOrderListResponse>("admin/order/getAllOrders", {
      params,
    });
  },

  getByID(id: string) {
    return axiosClient.get<{ success: boolean; message: string; data: IOrder }>(
      `admin/order/${id}`
    );
  },

  updateStatus(id: string, orderStatus: string) {
    return axiosClient.put<{ success: boolean; message: string; data: IOrder }>(
      `admin/order/update/${id}`, { orderStatus }
    );
  }
};

export default orderApi;
