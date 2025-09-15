import React, { useState } from 'react';
import { Objeto } from '../types';
import './PublicationForm.css';

interface PublicationFormProps {
  onSubmit: (objeto: Omit<Objeto, 'id'>) => void;
  onCancel?: () => void;
}

const PublicationForm: React.FC<PublicationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    lugar: '',
    fecha: new Date().toISOString().split('T')[0], // Today's date as default
    estado: 'perdido' as 'perdido' | 'encontrado',
    usuario: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    if (!formData.lugar.trim()) {
      newErrors.lugar = 'El lugar es obligatorio';
    }
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }
    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre del usuario es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="publication-form-container">
      <h2>Crear Nueva Publicación</h2>
      <form onSubmit={handleSubmit} className="publication-form">
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej: Mochila negra, Llaves perdidas..."
            className={errors.titulo ? 'error' : ''}
          />
          {errors.titulo && <span className="error-message">{errors.titulo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe el objeto perdido o encontrado..."
            rows={4}
            className={errors.descripcion ? 'error' : ''}
          />
          {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lugar">Lugar *</label>
          <input
            type="text"
            id="lugar"
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            placeholder="Ej: Biblioteca piso 2, Patio central..."
            className={errors.lugar ? 'error' : ''}
          />
          {errors.lugar && <span className="error-message">{errors.lugar}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha *</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className={errors.fecha ? 'error' : ''}
          />
          {errors.fecha && <span className="error-message">{errors.fecha}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado *</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="perdido">Perdido</option>
            <option value="encontrado">Encontrado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="usuario">Tu Nombre *</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            className={errors.usuario ? 'error' : ''}
          />
          {errors.usuario && <span className="error-message">{errors.usuario}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Crear Publicación
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PublicationForm;