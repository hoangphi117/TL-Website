// src/context/CustomerAuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { type IUser } from "@/types/user"; // Import interface IUser gốc (có addresses)
import { authService } from "@/services/api/customer/auth.service";

// Mở rộng IUser để thêm username (nếu logic frontend cần)
export type AuthUser = IUser & { username?: string };

interface TokenPayload {
  id: string;
  role: string;
  exp: number;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<AuthResult>;
  registerAuth: (data: any) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (data: Partial<IUser>) => Promise<AuthResult>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- INIT: Check Login khi load trang ---
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        // Load user từ localStorage để hiển thị ngay lập tức
        setUser(JSON.parse(storedUser));

        // Gọi API lấy thông tin mới nhất (để sync data nếu server có thay đổi)
        try {
          const latestUser = await authService.getMe();
          // Map dữ liệu để đảm bảo nhất quán
          const fullUserData: AuthUser = {
            ...latestUser,
            username: latestUser.fullName || latestUser.email,
          };
          setUser(fullUserData);
          localStorage.setItem("user", JSON.stringify(fullUserData));
        } catch (error) {
          // Nếu token hết hạn hoặc lỗi, có thể cân nhắc logout hoặc giữ nguyên data cũ
          console.error("Token expired or invalid", error);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // --- LOGIN ---
  const login = async (input: {
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      const response: any = await authService.login(input);

      if (response.token) {
        localStorage.setItem("accessToken", response.token);

        // Lấy thông tin user chi tiết
        try {
          const userDetail = await authService.getMe();
          const fullUserData: AuthUser = {
            ...userDetail,
            username: userDetail.fullName || userDetail.email,
          };

          setUser(fullUserData);
          localStorage.setItem("user", JSON.stringify(fullUserData));

          return { success: true, message: "Đăng nhập thành công" };
        } catch (infoError) {
          // Fallback nếu không lấy được info chi tiết nhưng có token
          const decoded = jwtDecode<TokenPayload>(response.token);
          const fallbackUser: AuthUser = {
            _id: decoded.id,
            email: input.email,
            role: decoded.role as "admin" | "customer",
            fullName: "User",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            addresses: [], // Mảng rỗng fallback
          };
          setUser(fallbackUser);
          localStorage.setItem("user", JSON.stringify(fallbackUser));
          return {
            success: true,
            message: "Đăng nhập thành công (Dữ liệu hạn chế)",
          };
        }
      }

      return {
        success: false,
        message: response.message || "Đăng nhập thất bại",
      };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi kết nối server";
      return { success: false, message: msg };
    }
  };

  // --- REGISTER ---
  const registerAuth = async (input: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      const payload = {
        fullName: input.fullName,
        email: input.email,
        password: input.password,
      };
      const response: any = await authService.register(payload);
      if (response.user || response.message) {
        return {
          success: true,
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
        };
      }
      return { success: false, message: "Đăng ký thất bại" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi server khi đăng ký",
      };
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Chuyển hướng hoặc reload trang nếu cần
    window.location.href = "/auth/login/customer";
  };

  // --- UPDATE PROFILE (Logic quan trọng mới update) ---
  const updateUser = async (data: Partial<IUser>): Promise<AuthResult> => {
    try {
      // 1. Gọi API gửi payload (bao gồm cả addresses mới nếu có)
      const res: any = await authService.updateProfile(data);

      // 2. Xử lý phản hồi từ Server
      // Dựa vào userController của bạn: trả về { message: "...", user: saveUser }
      if (res.user) {
        const updatedUserFromServer = res.user;

        // Map thêm các trường phụ trợ Frontend cần (username)
        const newUserData: AuthUser = {
          ...updatedUserFromServer,
          username:
            updatedUserFromServer.fullName || updatedUserFromServer.email,
        };

        // 3. Cập nhật State và LocalStorage ngay lập tức
        setUser(newUserData);
        localStorage.setItem("user", JSON.stringify(newUserData));

        return { success: true, message: "Cập nhật thành công" };
      }

      // Trường hợp Server trả về success nhưng không có object user (phòng hờ)
      // Ta sẽ merge thủ công data cũ + data mới để update UI
      if (user) {
        const mergedUser = { ...user, ...data };
        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
        return { success: true, message: "Cập nhật thành công" };
      }

      return { success: false, message: "Không thể cập nhật thông tin" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi cập nhật",
      };
    }
  };

  // --- CHANGE PASSWORD ---
  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResult> => {
    try {
      await authService.changePassword({
        password: oldPassword,
        new_password: newPassword,
      });
      return { success: true, message: "Đổi mật khẩu thành công" };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi đổi mật khẩu",
      };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    registerAuth,
    logout,
    updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
