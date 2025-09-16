import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostListado from '../components/PostListado';
import { publicacionesApi } from '../services/api';
import type { Publicacion } from '../types/types';

const ListadoObjetosPerdidos: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    publicacionesApi.obtenerTodas().then(setPublicaciones);
  }, []);

  return (
    <div>
      <h1>Listado de objetos perdidos</h1>
      {publicaciones.length === 0 ? (
        <p>No hay publicaciones.</p>
      ) : (
        publicaciones.map((pub) => (
          <div key={pub.id} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
            <PostListado {...pub} />
            <button onClick={() => navigate(`/publicacion/${pub.id}`)}>
              Ver detalles
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ListadoObjetosPerdidos;
