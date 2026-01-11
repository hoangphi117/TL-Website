import type { IUserLoginResponse } from "@/types/user";
import axiosClient from "./axiosClient";

const authApi = {
  login(email: string, password: string) {
    return axiosClient.post<{ message: string; token: string; expiresIn: string; user: IUserLoginResponse }>(
      "/auth/login/admin",
      { email, password }
    );
  },
};

export default authApi;
