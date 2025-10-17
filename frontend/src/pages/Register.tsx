import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuariosApi } from "../services/api";
import "../styles/Login.css";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirm_password: "",
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
    
    // Validar que las contraseñas coincidan
    if (registerData.password !== registerData.confirm_password) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    try {
      await usuariosApi.crear({
        nombre: registerData.nombre,
        email: registerData.email,
        password: registerData.password,
        telefono: registerData.telefono,
      });
      alert("¡Se ha creado la cuenta exitosamente!");
      navigate("/login");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Error al registrarse. Intenta nuevamente.";
      alert(errorMsg);
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
                    <label htmlFor="nombre">Nombre</label>
                    <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={registerData.nombre}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="email">Correo</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label htmlFor="telefono">Teléfono (opcional)</label>
                    <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={registerData.telefono}
                    onChange={handleChange}
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