import { Navigate } from "react-router-dom";
import { authApi } from "../services/api";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rutas, redirige a /login si el usuario no está autenticado
 * Verifica localStorage para detectar cambios de sesión
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState(authApi.getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar usuario actual
    const currentUser = authApi.getStoredUser();
    setUser(currentUser);
    setIsLoading(false);

    // Escuchar cambios en localStorage (cuando se hace logout en otra pestaña)
    const handleStorageChange = () => {
      const updatedUser = authApi.getStoredUser();
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
