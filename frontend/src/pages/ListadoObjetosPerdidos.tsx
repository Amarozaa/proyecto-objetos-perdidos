import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicacionesApi } from '../services/api';
import type { Publicacion } from '../types/types';
import "../styles/Listado.css";

const ListadoObjetosPerdidos: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'Todos' | 'Perdido' | 'Encontrado'>('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    publicacionesApi.obtenerTodas().then(setPublicaciones);
  }, []);

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

  // Filtrar publicaciones según el tipo seleccionado
  const publicacionesFiltradas = publicaciones.filter(pub => {
    if (filtroTipo === 'Todos') return true;
    return pub.tipo === filtroTipo;
  });

  return (
    <div className="listado-container">
      <h1>Listado de objetos perdidos</h1>
      
      {/* Switch/Filtros */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        gap: '10px',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '8px'
      }}>
        <button
          onClick={() => setFiltroTipo('Todos')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: filtroTipo === 'Todos' ? '#4a90a4' : 'white',
            color: filtroTipo === 'Todos' ? 'white' : '#333',
            fontWeight: filtroTipo === 'Todos' ? 'bold' : 'normal'
          }}
        >
          Todos ({publicaciones.length})
        </button>
        <button
          onClick={() => setFiltroTipo('Perdido')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: filtroTipo === 'Perdido' ? '#4a90a4' : 'white',
            color: filtroTipo === 'Perdido' ? 'white' : '#333',
            fontWeight: filtroTipo === 'Perdido' ? 'bold' : 'normal'
          }}
        >
        Perdidos ({publicaciones.filter(p => p.tipo === 'Perdido').length})
        </button>
        <button
          onClick={() => setFiltroTipo('Encontrado')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: filtroTipo === 'Encontrado' ? '#4a90a4' : 'white',
            color: filtroTipo === 'Encontrado' ? 'white' : '#333',
            fontWeight: filtroTipo === 'Encontrado' ? 'bold' : 'normal'
          }}
        >
        Encontrados ({publicaciones.filter(p => p.tipo === 'Encontrado').length})
        </button>
      </div>

      {publicacionesFiltradas.length === 0 ? (
        <p>No hay publicaciones{filtroTipo !== 'Todos' ? ` de tipo "${filtroTipo}"` : ''}.</p>
      ) : (
        publicacionesFiltradas.map((pub) => {
          const colorCategoria = obtenerColorCategoria(pub.categoria);
          return (
            <div key={pub.id} className="card-publicacion">
              <div className="card-contenido">
                <h2>
                  {pub.titulo}
                  <span 
                    className="categoria"
                    style={{
                      backgroundColor: colorCategoria.bg,
                      color: colorCategoria.text,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginLeft: '10px'
                    }}
                  >
                    {pub.categoria}
                  </span>
                </h2>
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                  {pub.fecha_creacion ? formatearFechaAmigable(pub.fecha_creacion) : 'Fecha no disponible'}
                </p>
                <p>{pub.descripcion}</p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '10px'
                }}>
                  {/* Botón Ver detalles ahora a la izquierda */}
                  <button
                    className="boton-detalles"
                    onClick={() => navigate(`/publicacion/${pub.id}`)}
                  >
                    Ver detalles
                  </button>
                  {/* Estado ahora a la derecha */}
                  <span style={{
                    color: pub.estado === 'Resuelto' ? '#4caf50' : '#ff9800',
                    backgroundColor: pub.estado === 'Resuelto' ? '#4caf5020' : '#ff980020',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {pub.estado}
                  </span>
                </div>
              </div>
              <div className="card-imagen">
                {pub.imagen_url ? (
                  <img src={pub.imagen_url} alt={pub.titulo} />
                ) : (
                  <span>Sin imagen</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ListadoObjetosPerdidos;