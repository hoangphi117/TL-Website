import axiosClient from "@/services/api/customer/axiosClient";
import { type AuthUser } from "@/context/CustomerAuthContext";
import { type IUser } from "@/types/user";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token?: string;
  user?: AuthUser;
}

export const authService = {
  register: async (data: RegisterPayload) => {
    return axiosClient.post<any, AuthResponse>("/auth/register/customer", data);
  },

  login: async (data: LoginPayload) => {
    return axiosClient.post<any, AuthResponse>("/auth/login/customer", data);
  },

  getMe: async (): Promise<AuthUser> => {
    const res: any = await axiosClient.get(`/users/me`);
    return res.data || res;
  },
  forgotPassword: async (email: string) => {
    return axiosClient.post("/auth/reset-password", { email });
  },
  resetPassword: async (token: string, password: string) => {
    return axiosClient.post(`/auth/reset-password/${token}`, { password });
  },
  updateProfile: async (data: Partial<IUser>) => {
    return axiosClient.put<any, AuthResponse>("/users/me", data);
  },
  changePassword: async (data: { password: string; new_password: string }) => {
    return axiosClient.post<any, AuthResponse>("/users/change-password", data);
  },
};
