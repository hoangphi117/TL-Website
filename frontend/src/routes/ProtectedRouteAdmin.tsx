import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AdminAuthContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedRouteAdmin ({ children }: Props) {

  const {user, isLoading} = useAuth();
  if(isLoading) {
    return <div>Loading...</div>
  }
  
  if(!user){
    return <Navigate to="/admin/login" replace />
  }

  return children;
}