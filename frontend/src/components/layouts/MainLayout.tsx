import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

// --- 1. DEFINE TYPESCRIPT FOR PROPS ---
interface MainLayoutProps {
  children: React.ReactNode;
}

// --- 2. COMPONENT MAINLAYOUT ---
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-[#ececec] pt-16 md:pt-0 w-full">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">{children}</div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
