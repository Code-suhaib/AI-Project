import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // If user is NOT logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → allow access to protected routes
  return <Outlet />;
}
