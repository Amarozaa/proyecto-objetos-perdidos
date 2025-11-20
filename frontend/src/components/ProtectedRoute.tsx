import { Navigate } from "react-router-dom";
import { authApi } from "../services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas, redirige a /login si el usuario no está autenticado
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = authApi.getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
