import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Footer from "../common/Footer";
import ScrollToTop from "../common/ScrollToTop";
import authBG from "@/assets/images/auth-bg.jpg";

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

const AuthLayout: React.FC = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <style>{autofillFixStyle}</style>
        <ScrollToTop />

        <main
          className="flex-1 w-full bg-cover bg-center bg-fixed relative flex flex-col"
          style={{
            backgroundImage: `url(${authBG})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 z-0" />

          <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AuthLayout;
