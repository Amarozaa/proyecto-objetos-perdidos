import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuariosApi } from "../services/api";
import "../styles/Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    usuario : "",
    password : "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { usuario, password } = loginData;
      const data = await usuariosApi.auth(usuario, password);
      alert("¡Se ha ingresado a la cuenta exitosamente!");
      console.log("Usuario autenticado:", data.nombre);
      navigate("/");
    } catch {
      alert("Error al crear iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ObjetosUni</h1>
        <p>La siguiente plataforma te permite publicar sobre objetos perdidos o encontrados dentro de la facultad </p>
        <h2>¡Ingresa a tu cuenta!</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-box">
                <hr></hr>
                <div>
                    <label htmlFor="usuario">Usuario</label>
                    <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    value={loginData.usuario}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    />
                </div>

                <button type="submit">Ingresar</button>
                <div className="register-text">
                  <p>¿No tienes cuenta?</p> 
                  <a className={`login-page${window.location.pathname === "/register" ? " active" : ""}`} 
                    href="/register">Regístrate</a>
                </div>
                <hr></hr>
            </div>
        </form>
      </div>
    </div>
  );
};
export default Login;