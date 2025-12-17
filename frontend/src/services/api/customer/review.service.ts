import axiosClient from "./axiosClient";

export const reviewService = {
  getReviewsByProduct: async (productId: string) => {
    return axiosClient.get(`/review/${productId}`);
  },
};
