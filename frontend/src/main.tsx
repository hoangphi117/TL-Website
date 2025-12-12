import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/CustomerAuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
