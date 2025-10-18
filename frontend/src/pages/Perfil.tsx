import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Publicacion, Usuario } from "../types/types";
import { publicacionesApi, usuariosApi, displayApi } from "../services/api";
import "../styles/Perfil.css";
import "../styles/Listado.css";

const Perfil: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState<Publicacion[] | null>(
    null
  );
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const userData = await usuariosApi.obtenerPorId(id);
        setUsuario(userData);

        const publicacionesData = await publicacionesApi.obtenerTodasUsuario(
          id
        );
        setPublicaciones(publicacionesData);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!usuario) return <p>Usuario no encontrado</p>;
  if (!publicaciones) return <p>Publicaciones no encontradas</p>;

  return (
    <div className="perfil-container">
      <div className="data-container perfil-datos-box">
        <h1>Mis datos</h1>
        <div className="perfil-img-box">
          {usuario.imagen_url ? (
            <img
              src={usuario.imagen_url}
              alt="Foto usuario"
              width="188"
              height="188"
            />
          ) : (
            <div className="perfil-img-placeholder">Sin imagen</div>
          )}
        </div>
        <div className="perfil-datos-info">
          <p className="perfil-nombre">
            <strong>{usuario.nombre}</strong>
          </p>
          <p>
            <strong>Teléfono: </strong>
            {usuario.telefono && usuario.telefono.trim() !== ""
              ? usuario.telefono
              : <span className="perfil-dato-no">no disponible</span>}
          </p>
          <p>
            <strong>Correo: </strong> {usuario.email}
          </p>
        </div>
        <button className="edit-btn">Editar datos</button>
      </div>
      <div className="listado-container">
        <h1> Mis publicaciones</h1>
        {publicaciones.length === 0 ? (
          <p>No hay publicaciones todavía</p>
        ) : (
          publicaciones.map((pub) => {
            return (
              <div key={pub.id} className="card-publicacion">
                <div className="card-contenido">
                  <h2>
                    {" "}
                    {pub.titulo}
                    <span
                      className={`categoria ${
                        pub.categoria === "Electrónicos"
                          ? "electronicos"
                          : pub.categoria === "Ropa"
                          ? "ropa"
                          : pub.categoria === "Documentos"
                          ? "documentos"
                          : pub.categoria === "Accesorios"
                          ? "accesorios"
                          : pub.categoria === "Deportes"
                          ? "deportes"
                          : pub.categoria === "Útiles"
                          ? "utiles"
                          : "otros"
                      }`}
                    >
                      {" "}
                      {pub.categoria}
                    </span>
                  </h2>
                  <p className="fecha-amigable">
                    {pub.fecha_creacion
                      ? displayApi.formatearFechaAmigable(pub.fecha_creacion)
                      : "Fecha no disponible"}
                  </p>
                  <p>{pub.descripcion}</p>
                  <div className="card-acciones">
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="boton-detalles"
                        onClick={() => navigate(`/publicacion/${pub.id}`)}
                      >
                        Ver detalles
                      </button>
                      <button className="edit-btn">Editar</button>
                    </div>
                    <span
                      className={`estado-publicacion${
                        pub.estado === "Resuelto" ? " resuelto" : ""
                      }`}
                    >
                      {pub.estado}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Perfil;
