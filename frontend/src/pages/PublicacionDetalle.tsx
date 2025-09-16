import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicacionesApi, usuariosApi } from '../services/api';
import { Publicacion, Usuario } from '../types/types';
import "../styles/PublicacionDetalle.css"

const PublicacionDetalle: React.FC = () => {
  const { id } = useParams();
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

  if (!publicacion) {
    return <div>No se encontró la publicación.</div>;
  }

  return (
    <div className="detalle-container">
      <h2>Detalles de la publicación</h2>

      <div className="detalle-card">
        <div className="detalle-contenido">
          <h3>
            {publicacion.titulo}
            <span className="categoria">{publicacion.categoria}</span>
            <span className="estado">{publicacion.estado}</span>
          </h3>

          <p><strong>Publicado por:</strong> {usuario ? usuario.nombre : "No disponible"}</p>
          <p><strong>Fecha de publicación:</strong> {publicacion.fecha}</p>
          <p><strong>Encontrado en:</strong> {publicacion.lugar}</p>
          <p><strong>Tipo:</strong> {publicacion.tipo}</p>
          <p><strong>Descripción:</strong> {publicacion.descripcion}</p>

          <button className="boton-cerrar">Cerrar detalles</button>
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
