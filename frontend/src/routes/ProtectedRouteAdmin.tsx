import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AdminAuthContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedRouteAdmin ({ children }: Props) {

  // const {user} = useAuth();
  const token = localStorage.getItem("admin_access_token");

    if(!token){
        return <Navigate to="/admin/login" replace />
    }

    return children;
}