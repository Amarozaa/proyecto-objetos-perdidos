import React from "react";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  return (
    <div style={{ textAlign: "center", margin: "1rem" }}>
      <div className="navbar">
        <img id="logo-id" src="/images/local/buscar.png" alt="Logo" />
        <h1>ObjetosUni</h1>
        <a
          className={`navbar-page${
            window.location.pathname === "/listado" ? " active" : ""
          }`}
          href="/listado"
        >
          Buscar
        </a>
        <a
          className={`navbar-page${
            window.location.pathname === "/formulario" ? " active" : ""
          }`}
          href="/formulario"
        >
          Publicar
        </a>
        <a
          className={`navbar-page${
            window.location.pathname.startsWith("/perfil") ? " active" : ""
          }`}
          href={`/perfil/${1}`}
        >
          Perfil
        </a>
        <button className="big-btn"> Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Navbar;
