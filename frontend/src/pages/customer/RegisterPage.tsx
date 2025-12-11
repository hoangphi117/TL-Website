import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/icons/TL-Logo.png";
import Footer from "@/components/common/Footer";
Footer;

const autofillFixStyle = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #151517 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-700 ">
      <style>{autofillFixStyle}</style>

      <main className="flex-grow flex items-center justify-center p-10">
        <div className="w-full max-w-5xl bg-[#151517] bg-opacity-90 p-8 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col lg:flex-row gap-10 border border-gray-800">
          {/* --- FORM SECTION --- */}
          <div className="w-full lg:w-1/2">
            <div className="flex justify-center mb-4">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-16 w-16 object-contain"
                />
              ) : (
                <h1 className="text-3xl font-bold text-white">LOGO</h1>
              )}
            </div>

            <h2 className="text-2xl font-bold text-center text-red-500 mb-2">
              Đăng ký tài khoản
            </h2>
            <p className="text-center text-gray-400 text-sm mb-6">
              Đăng ký để sử dụng tất cả tính năng
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border border-gray-600 outline-none  transition-all"
                />
                <label
                  htmlFor="username"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Tên tài khoản
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border border-gray-600 outline-none  transition-all"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Email
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border border-gray-600 outline-none  transition-all"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder=" "
                  className="peer w-full px-4 pt-5 pb-2 text-white bg-[#151517] rounded-lg border border-gray-600 outline-none  transition-all"
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base transition-all duration-200 cursor-text
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-200
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-200"
                >
                  Nhập lại mật khẩu
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/20 mt-4 cursor-pointer"
              >
                Đăng ký
              </button>
            </form>

            <p className="text-gray-400 text-sm text-center mt-6">
              Đã có tài khoản?{" "}
              <Link
                to="/customer/login"
                className="text-md font-bold text-red-500 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* --- INFO SECTION (UI Only) --- */}
          <div className="w-full lg:w-1/2 text-gray-300 border-t lg:border-t-0 lg:border-l border-gray-700 pt-6 lg:pt-0 lg:pl-10 flex flex-col ">
            <h2 className="text-xl font-bold mb-6 text-red-500 border-b border-gray-700 pb-2 inline-block">
              Yêu cầu tài khoản
            </h2>
            <ul className="space-y-4 text-sm list-disc list-inside text-gray-400">
              <li className="marker:text-red-500">
                <span className="text-gray-300">Tên người dùng:</span> Tối thiểu
                4 ký tự, không để trống.
              </li>
              <li className="marker:text-red-500">
                <span className="text-gray-300">Email:</span> Phải đúng định
                dạng (ví dụ: ten@domain.com).
              </li>
              <li className="marker:text-red-500">
                <span className="text-gray-300">Mật khẩu:</span> Ít nhất 8 ký
                tự.
              </li>
              <li className="marker:text-red-500">
                <span className="text-gray-300">Độ mạnh mật khẩu:</span> Phải
                chứa chữ hoa (A-Z), chữ thường (a-z) và số (0-9).
              </li>
              <li className="marker:text-red-500">
                <span className="text-gray-300">Xác nhận:</span> Mật khẩu nhập
                lại phải trùng khớp hoàn toàn.
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
