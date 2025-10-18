import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setErrorDetails([]);

    if (registerData.password !== registerData.confirm_password) {
      setErrorMsg("Las contraseñas no coinciden");
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
    } catch (error) {
      let msg = "Error al registrarse. Intenta nuevamente.";
      let detalles: string[] = [];
      interface AxiosError {
        response?: {
          data?: {
            error?: string;
            detalles?: string[];
          };
        };
      }
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        msg = err.response.data.error || msg;
        if (
          err.response.data.detalles &&
          Array.isArray(err.response.data.detalles)
        ) {
          detalles = err.response.data.detalles;
        }
      }
      setErrorMsg(msg);
      setErrorDetails(detalles);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ObjetosUni</h1>
        <h2>¡Regístrate!</h2>
        {errorMsg && (
          <div
            style={{
              color: "#c62828",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            {errorMsg}
            {errorDetails.length > 0 && (
              <ul
                style={{
                  marginTop: "0.5rem",
                  paddingLeft: "1.2rem",
                  color: "#c62828",
                  fontWeight: "normal",
                }}
              >
                {errorDetails.map((detalle, idx) => (
                  <li key={idx}>{detalle}</li>
                ))}
              </ul>
            )}
          </div>
        )}
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
                placeholder="Tu nombre completo"
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
                placeholder="ejemplo@correo.com"
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
                placeholder="Ej: +56912345678"
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
                placeholder="Mínimo 6 caracteres"
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
                placeholder="Repite la contraseña"
              />
            </div>
            <button type="submit">Crear cuenta</button>
            <div className="register-text">
              <p>¿Ya tienes cuenta?</p>
              <Link to="/login" className="login-page">
                Ingresar
              </Link>
            </div>
            <hr></hr>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;
