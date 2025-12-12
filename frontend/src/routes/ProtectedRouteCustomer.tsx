import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/context/CustomerAuthContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedRouteCustomer({ children }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login/customer" replace />;
  }

  return children;
}
