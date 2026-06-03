import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute() {
  const { user } = useAuth();

  // Si no hay sesión activa, redirige al login de inmediato
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, le permite continuar y ver el componente hijo
  return <Outlet />;
}