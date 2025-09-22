import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Publicacion, Usuario } from '../types/types';
import { publicacionesApi, usuariosApi, displayApi } from '../services/api';
import '../styles/Perfil.css' 
import '../styles/Listado.css' 

const Perfil: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [publicaciones, setPublicaciones] = useState<Publicacion[] | null>(null);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if(!id) return;
            try {
                const userData = await usuariosApi.obtenerPorId(Number(id));
                setUsuario(userData);

                const publicacionesData = await publicacionesApi.obtenerTodasUsuario(Number(id));
                setPublicaciones(publicacionesData);
            }
            catch(error) {
                console.error("Error cargando perfil:", error);
            }
        } 
         fetchData();
    }, [id]); 

  if (!usuario) return <p>Usuario no encontrado</p>;
  if (!publicaciones) return <p>Publicaciones no encontradas</p>
 
  return (
    <div style={{ textAlign: 'center', margin: '1rem' }}>
      <div className="perfil-container">
        <div className="data-container">
            <h1> Mis datos</h1>
            {usuario.imagen_url ? (
                  <img src={usuario.imagen_url} alt="Foto usuario" width="188" height="188"/>
                ) : (
                  <span>Sin imagen</span>
                )}
            <p><strong> {usuario.nombre} </strong></p>
            <p><strong>Teléfono: </strong> {usuario.telefono}</p>
            <p><strong>Correo: </strong> {usuario.email}</p>
            <button className="edit-btn">Editar datos</button>
        </div>
        <div className="listado-container">
            <h1> Mis publicaciones</h1>
                {publicaciones.length === 0 ? (
                    <p>No hay publicaciones todavía</p>
                ) : (
                publicaciones.map((pub) => {
                    const colorCategoria = displayApi.obtenerColorCategoria(pub.categoria);
                    return (
                        <div key={pub.id} className="card-publicacion">
                        <div className="card-contenido">
                        <h2> {pub.titulo}
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
                            }}> {pub.categoria}
                            </span>
                        </h2>
                        <p style={{ color: '#666', fontSize: '14px', margin: '5px 0', textAlign: 'left' }}>
                            {pub.fecha_creacion ? displayApi.formatearFechaAmigable(pub.fecha_creacion) : 'Fecha no disponible'}
                        </p>
                        <p style={{ textAlign: 'left' }}>{pub.descripcion}</p>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginTop: '10px'
                        }}>
                        {/* Botón Ver detalles ahora a la izquierda */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="boton-detalles"
                            onClick={() => navigate(`/publicacion/${pub.id}`)}
                          >
                          Ver detalles
                          </button>
                          <button className="edit-btn">Editar</button>
                        </div>
                        {/* Estado ahora a la derecha */}
                        <span style={{
                            color: pub.estado === 'Resuelto' ? '#4caf50' : '#ff9800',
                            backgroundColor: pub.estado === 'Resuelto' ? '#4caf5020' : '#ff980020',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}> {pub.estado}
                        </span>
                    </div>
                </div>
                </div>
            );
            })
        )}

        </div>
      </div>

    </div>
  );
};

export default Perfil;