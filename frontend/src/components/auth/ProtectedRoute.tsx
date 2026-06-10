import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function getDashboardPath(role?: string) {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return "/admin";
  }

  return "/dashboard";
}

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={getDashboardPath(user?.role)} replace />;
}