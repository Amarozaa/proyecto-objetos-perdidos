import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("✅ Formulario enviado (solo estático)");
    navigate("/"); // redirige al home
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Crear publicación</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Lugar:</label>
          <input
            type="text"
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Tipo:</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="Perdido">Perdido</option>
            <option value="Encontrado">Encontrado</option>
          </select>
        </div>

        <div>
          <label>Categoría:</label>
          <select
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

        <div>
          <label>Imagen:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {formData.imagen_url && (
          <p>
            Imagen seleccionada: <strong>{formData.imagen_url}</strong>
          </p>
        )}

        <button type="submit" style={{ marginTop: "1rem" }}>
          Crear publicación
        </button>
      </form>
    </div>
  );
};

export default FormularioPublicacion;
