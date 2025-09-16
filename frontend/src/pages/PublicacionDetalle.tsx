import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicacionesApi, usuariosApi } from '../services/api';
import { Publicacion, Usuario } from '../types/types';

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
    <div>
      <h2>
        {publicacion.titulo} - {publicacion.categoria}
      </h2>
      <div>
        <strong>Publicado por:</strong>
        {usuario ? (
          <span> {usuario.nombre} ({usuario.email})</span>
        ) : (
          <span> No disponible</span>
        )}
      </div>
      <p><strong>Fecha de publicación:</strong> {publicacion.fecha}</p>
      <p><strong>Encontrado en:</strong> {publicacion.lugar}</p>
      <p><strong>Tipo:</strong> {publicacion.tipo}</p>
      <p><strong>Estado:</strong> {publicacion.estado}</p>
      <p className="descripcion"><strong>Descripción:</strong> {publicacion.descripcion}</p>
      {publicacion.imagen_url && (
        <img src={publicacion.imagen_url} alt={publicacion.titulo} style={{ maxWidth: '300px' }} />
      )}
    </div>
  );
};

export default PublicacionDetalle;
