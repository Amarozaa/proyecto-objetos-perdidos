import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicacionesApi } from '../services/api';
import type { Publicacion } from '../types/types';
import "../styles/Listado.css";

const ListadoObjetosPerdidos: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    publicacionesApi.obtenerTodas().then(setPublicaciones);
  }, []);

  return (
    <div className="listado-container">
      <h1>Listado de objetos perdidos</h1>
      {publicaciones.length === 0 ? (
        <p>No hay publicaciones.</p>
      ) : (
        publicaciones.map((pub) => (
          <div key={pub.id} className="card-publicacion">
            <div className="card-contenido">
              <h2>
                {pub.titulo}
                <span className="categoria">{pub.categoria}</span>
              </h2>
              <p>{pub.fecha_creacion}</p>
              <p>{pub.descripcion}</p>
              <button
                className="boton-detalles"
                onClick={() => navigate(`/publicacion/${pub.id}`)}
              >
                Ver detalles
              </button>
            </div>
            <div className="card-imagen">
              {pub.imagen_url ? (
                <img src={pub.imagen_url} alt={pub.titulo} />
              ) : (
                <span>Sin imagen</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListadoObjetosPerdidos;
