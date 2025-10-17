import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";
import "../styles/Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
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
      const { email, password } = loginData;
      const data = await authApi.login({ email, password });

      // Guardar usuario en localStorage
      authApi.setCurrentUser(data);

      alert("¡Se ha ingresado a la cuenta exitosamente!");
      console.log("Usuario autenticado:", data.nombre);
      navigate("/publicaciones");
    } catch {
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ObjetosUni</h1>
        <p>
          La siguiente plataforma te permite publicar sobre objetos perdidos o
          encontrados dentro de la facultad{" "}
        </p>
        <h2>¡Ingresa a tu cuenta!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-box">
            <hr></hr>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@correo.com"
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
              <Link to="/register" className="login-page">
                Regístrate
              </Link>
            </div>
            <hr></hr>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
