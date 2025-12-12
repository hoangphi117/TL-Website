// src/context/auth.tsx
import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { type IUser } from "@/types/user";
import { authService } from "@/services/api/customer/auth.service";

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
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check login khi load trang
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Tùy chọn: Gọi API /auth/me để verify token còn sống không
      // try {
      //   const res = await authService.getMe();
      //   setUser(res.user);
      // } catch { logout(); }

      setIsLoading(false);
    };
    initAuth();
  }, []);

  // --- FUNCTION LOGIN ---
  const login = async (input: {
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      // BƯỚC 1: Gọi Login lấy Token
      const response: any = await authService.login(input);

      if (response.token) {
        localStorage.setItem("accessToken", response.token);

        // BƯỚC 2: Giải mã Token để lấy ID
        // Backend của bạn code: const payload = { id: user.id, role: user.role }
        const decoded = jwtDecode<TokenPayload>(response.token);

        try {
          // BƯỚC 3: Gọi API lấy thông tin chi tiết User bằng ID vừa giải mã
          const userDetail = await authService.getMe();

          // Map dữ liệu nếu cần (đảm bảo có trường username/fullName)
          const fullUserData: AuthUser = {
            ...userDetail,
            username: userDetail.fullName || userDetail.email, // Fallback nếu không có username
          };

          setUser(fullUserData);
          localStorage.setItem("user", JSON.stringify(fullUserData));

          return { success: true, message: "Đăng nhập thành công" };
        } catch (infoError) {
          // Trường hợp Login đúng Token nhưng không lấy được Info (do lỗi API get user)
          console.error("Lỗi lấy thông tin user:", infoError);

          // Vẫn cho đăng nhập nhưng dùng thông tin tối thiểu từ Token
          const fallbackUser: AuthUser = {
            _id: decoded.id,
            email: input.email,
            role: decoded.role as "admin" | "customer",
            fullName: "User", // Tên tạm
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

  // --- FUNCTION REGISTER ---
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
      console.error("Register error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Lỗi server khi đăng ký",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/auth/login/customer";
  };

  const value = {
    user,
    isLoading,
    login,
    registerAuth,
    logout,
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
