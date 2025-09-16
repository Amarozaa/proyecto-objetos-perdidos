import React from 'react';

import { useState } from "react";
import axios from "axios";
import { CrearPublicacion, Tipo, Categoria, Estado, Publicacion, Usuario } from "../types/types";

interface Props {
  usuario: Usuario;
  onPublicacionCreada: (pub: Publicacion) => void;
}

const FormularioPublicacion: React.FC<Props> = ({ usuario, onPublicacionCreada }) => {
  const [formData, setFormData] = useState<CrearPublicacion>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construimos la publicación con usuario y estado inicial
    const nuevaPublicacion: Omit<Publicacion, "id"> = {
      ...formData,
      estado: "No resuelto",
      usuario: usuario,
      fecha_creacion: new Date().toISOString(),
    };

    try {
      const res = await axios.post<Publicacion>(
        "http://localhost:3001/api/publicaciones",
        nuevaPublicacion
      );
      onPublicacionCreada(res.data);
      alert("✅ Publicación creada con éxito");
    } catch (err) {
      console.error(err);
      alert("❌ Error al crear la publicación");
    }
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
          <label>Fecha del hallazgo/pérdida:</label>
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
          <select name="categoria" value={formData.categoria} onChange={handleChange}>
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
          <label>Imagen (URL):</label>
          <input
            type="text"
            name="imagen_url"
            value={formData.imagen_url}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          Crear publicación
        </button>
      </form>
    </div>
  );
};

export default FormularioPublicacion;