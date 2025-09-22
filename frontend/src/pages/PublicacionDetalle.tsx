import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicacionesApi, usuariosApi } from '../services/api';
import { Publicacion, Usuario } from '../types/types';
import "../styles/PublicacionDetalle.css"

const PublicacionDetalle: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    if (id) {
      publicacionesApi.obtenerPorId(Number(id))
        .then((data) => {
          setPublicacion(data);
          if (data.usuario_id) {
            usuariosApi.obtenerPorId(Number(data.usuario_id))
              .then(setUsuario)
              .catch(() => setUsuario(null));
          } else {
            setUsuario(null);
          }
        })
        .catch(() => {
          setPublicacion(null);
          setUsuario(null);
        });
    }
  }, [id]);

  // Función para obtener colores por categoría
  const obtenerColorCategoria = (categoria: string) => {
    const colores: { [key: string]: { bg: string; text: string } } = {
      'Electrónicos': { bg: '#e3f2fd', text: '#1565c0' },
      'Ropa': { bg: '#f3e5f5', text: '#7b1fa2' },
      'Documentos': { bg: '#fff3e0', text: '#ef6c00' },
      'Accesorios': { bg: '#e8f5e8', text: '#2e7d32' },
      'Deportes': { bg: '#ffebee', text: '#c62828' },
      'Útiles': { bg: '#f1f8e9', text: '#558b2f' },
      'Otros': { bg: '#fafafa', text: '#616161' }
    };
    return colores[categoria] || colores['Otros'];
  };

  // Función para obtener color del estado
  const obtenerColorEstado = (estado: string) => {
    return {
      color: estado === 'Resuelto' ? '#4caf50' : '#ff9800',
      backgroundColor: estado === 'Resuelto' ? '#4caf50' : '#ff9800'
    };
  };

  // Función para formatear fecha de manera amigable
  const formatearFechaAmigable = (fechaString: string) => {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diferenciaMilisegundos = ahora.getTime() - fecha.getTime();
    const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) {
      return `Hoy a las ${fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (diferenciaDias === 1) {
      return `Ayer a las ${fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } else if (diferenciaDias <= 7) {
      return `Hace ${diferenciaDias} días`;
    } else {
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  // Switch según tipo de publicación
  const obtenerTextoSegunTipo = () => {
    if (!publicacion) return { accion: '', icono: '' };

    if (publicacion.tipo === 'Perdido') {
      return {
        accion: 'Perdido en:'
      };
    } else {
      return {
        accion: 'Encontrado en:'
      };
    }
  };

  if (!publicacion) {
    return (
      <div className="detalle-container">
        <div>No se encontró la publicación.</div>
        <button
          className="boton-cerrar"
          onClick={() => navigate('/listado')}
        >
          Volver al listado
        </button>
      </div>
    );
  }

  const colorCategoria = obtenerColorCategoria(publicacion.categoria);
  const colorEstado = obtenerColorEstado(publicacion.estado);
  const textos = obtenerTextoSegunTipo();

  return (
    <div className="detalle-container">
      <h2>Detalles de la publicación {textos.icono}</h2>

      <div className="detalle-card">
        <div className="detalle-contenido">
          <h3>
            {publicacion.titulo}
            <span
              className={`categoria ${
                publicacion.categoria === 'Electrónicos' ? 'electronicos' :
                publicacion.categoria === 'Ropa' ? 'ropa' :
                publicacion.categoria === 'Documentos' ? 'documentos' :
                publicacion.categoria === 'Accesorios' ? 'accesorios' :
                publicacion.categoria === 'Deportes' ? 'deportes' :
                publicacion.categoria === 'Útiles' ? 'utiles' : 'otros'
              }`}
            >
              {publicacion.categoria}
            </span>
            <span
              className={`estado ${publicacion.estado === 'Resuelto' ? 'resuelto' : 'pendiente'}`}
            >
              {publicacion.estado}
            </span>
          </h3>

          <p><strong>Publicado por:</strong> {usuario ? usuario.nombre : "Cargando usuario..."}</p>
          <p><strong>Fecha de publicación:</strong> {publicacion.fecha_creacion ? formatearFechaAmigable(publicacion.fecha_creacion) : 'No disponible'}</p>
          <p><strong>{textos.accion}</strong> {publicacion.lugar}</p>
          <p><strong>Tipo:</strong> {publicacion.tipo}</p>
          <p><strong>Fecha del suceso:</strong> {new Date(publicacion.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}</p>
          <p><strong>Descripción:</strong> {publicacion.descripcion}</p>

          <div style={{ marginTop: '20px' }}>
            <button
              className="boton-cerrar"
              onClick={() => navigate('/listado')}
            >
              Volver al listado
            </button>
          </div>
        </div>

        <div className="detalle-imagen">
          {publicacion.imagen_url ? (
            <img src={publicacion.imagen_url} alt={publicacion.titulo} />
          ) : (
            "Imagen"
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicacionDetalle;
