import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "{}"); 
  return (
    <div style={{ textAlign: 'center', margin: '1rem' }}>
      <div className="navbar">
        <img id="logo-id" src="/images/local/buscar.png" alt="Logo" />
        <h1>ObjetosUni</h1>
        <a className="navbar-page" href="/listado">Buscar</a>
        <a className="navbar-page" href="/formulario">Publicar</a>  
        <a className="navbar-page" href={`/perfil/${usuarioActual.id}`}>Perfil</a> 
        <button className="big-btn"> Cerrar sesión</button>  
      </div>
    </div>
  );
};

export default Navbar;
