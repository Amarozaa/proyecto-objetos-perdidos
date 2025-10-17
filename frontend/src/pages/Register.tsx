import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuariosApi } from "../services/api";
import "../styles/Login.css";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    usuario : "",
    email: "",
    password : "",
    confirm_password : "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usuariosApi.crear();
      alert("¡Se ha creado la cuenta exitosamente!");
      navigate("/");
    } catch {
      alert("Error al crear registrarse. Intenta nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ObjetosUni</h1>
        <h2>¡Regístrate!</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-box">
                <hr></hr>
                <div>
                    <label htmlFor="usuario">Usuario</label>
                    <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    value={registerData.usuario}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="email">Correo</label>
                    <input
                    type="text"
                    id="email"
                    name="email"
                    value={registerData.email}
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
                    value={registerData.password}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="confirm_password">Confirmar contraseña</label>
                    <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={registerData.confirm_password}
                    onChange={handleChange}
                    required
                    />
                </div>

                <button type="submit">Crear cuenta</button>
                <div className="register-text">
                  <p>¿Ya tienes cuenta?</p> 
                  <a className={`login-page${window.location.pathname === "/login" ? " active" : ""}`} 
                    href="/login">Ingresar</a>
                </div>
                <hr></hr>
            </div>
        </form>
      </div>
    </div>
  );
};
export default Register;