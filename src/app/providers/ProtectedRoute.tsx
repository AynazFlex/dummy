import { type ReactNode } from "react";
import { useAuth } from "@/hooks";
import { Navigate } from "react-router";

interface IProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};
