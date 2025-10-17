import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener usuario actual desde localStorage
  const currentUser = authApi.getStoredUser();
  const userId = currentUser?.id; 

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar localStorage de todas formas
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "1rem" }}>
      <div className="navbar">
        <img id="logo-id" src="/images/local/buscar.png" alt="Logo" />
        <h1>ObjetosUni</h1>
        <Link
          className={`navbar-page${
            location.pathname === "/publicaciones" ? " active" : ""
          }`}
          to="/publicaciones"
        >
          Buscar
        </Link>
        <Link
          className={`navbar-page${
            location.pathname === "/formulario" ? " active" : ""
          }`}
          to="/formulario"
        >
          Publicar
        </Link>
        <Link
          className={`navbar-page${
            location.pathname.startsWith("/perfil") ? " active" : ""
          }`}
          to={`/perfil/${userId}`}
        >
          Perfil
        </Link>
        <button className="big-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Navbar;
