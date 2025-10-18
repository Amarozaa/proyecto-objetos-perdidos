import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicacionesApi, authApi } from "../services/api";
import "../styles/FormularioPublicacion.css";
import type { CrearPublicacion } from "../types/types";

const FormularioPublicacion: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    lugar: "",
    fecha: "",
    tipo: "Perdido",
    categoria: "Otros",
    imagen_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        imagen_url: `/images/publicaciones/${e.target.files![0].name}`,
      }));
    }
  };

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setErrorDetails([]);

    if (!authApi.isAuthenticated()) {
      setErrorMsg("Debes iniciar sesión para publicar.");
      return;
    }

    try {
      // Validar campos requeridos antes de enviar
      if (
        !formData.titulo.trim() ||
        !formData.descripcion.trim() ||
        !formData.lugar.trim() ||
        !formData.fecha ||
        !formData.tipo ||
        !formData.categoria
      ) {
        setErrorMsg("Todos los campos son obligatorios.");
        return;
      }

      // Construir el objeto a enviar, omitiendo imagen_url si está vacío
      const publicacionBase: Omit<CrearPublicacion, "imagen_url"> = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        lugar: formData.lugar.trim(),
        fecha: formData.fecha,
        tipo: formData.tipo as "Perdido" | "Encontrado",
        categoria: formData.categoria as
          | "Electrónicos"
          | "Ropa"
          | "Documentos"
          | "Accesorios"
          | "Deportes"
          | "Útiles"
          | "Otros",
      };
      const publicacion: CrearPublicacion =
        formData.imagen_url && formData.imagen_url.trim() !== ""
          ? { ...publicacionBase, imagen_url: formData.imagen_url }
          : publicacionBase;

      await publicacionesApi.crear(publicacion);
      setErrorMsg("");
      setErrorDetails([]);
      navigate("/publicaciones");
    } catch (error) {
      let msg = "Error al crear la publicación. Intenta nuevamente.";
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
    <div className="formulario-publicacion-container">
      <h2 style={{ marginBottom: "1.5rem" }}>Crea una publicación</h2>
      <div className="formulario-publicacion-box">
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
          <div>
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Mochila negra, billetera, celular..."
            />
          </div>

          <div className="formulario-publicacion-row">
            <div>
              <label htmlFor="lugar">Lugar</label>
              <input
                type="text"
                id="lugar"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                required
                placeholder="¿Dónde se perdió o encontró?"
              />
            </div>
            <div>
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                placeholder="Fecha"
              />
            </div>
          </div>

          <div className="formulario-publicacion-row">
            <div>
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
              >
                <option value="Perdido">Perdido</option>
                <option value="Encontrado">Encontrado</option>
              </select>
            </div>
            <div>
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="Electrónicos">Electrónicos</option>
                <option value="Ropa">Ropa</option>
                <option value="Documentos">Documentos</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Deportes">Deportes</option>
                <option value="Útiles">Útiles</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              placeholder="Describe el objeto, características, color, marca, etc."
            />
          </div>

          <div>
            <label htmlFor="imagen">Imagen</label>
            <input
              id="imagen"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              placeholder="Sube una imagen del objeto"
            />
          </div>

          {formData.imagen_url && (
            <p>
              Imagen seleccionada: <strong>{formData.imagen_url}</strong>
            </p>
          )}

          <button type="submit">Publicar</button>
        </form>
      </div>
      <div className="formulario-publicacion-box" style={{ marginTop: "2rem" }}>
        <strong>¿Qué significa el tipo?</strong>
        <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
          <li>
            <strong>Perdido:</strong> significa que perdiste un objeto y quieres
            recuperarlo
          </li>
          <li>
            <strong>Encontrado:</strong> significa que encontraste un objeto y
            quieres devolverlo
          </li>
        </ul>
      </div>
    </div>
  );
};
export default FormularioPublicacion;
