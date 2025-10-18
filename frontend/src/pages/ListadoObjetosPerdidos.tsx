import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicacionesApi } from "../services/api";
import type { Publicacion } from "../types/types";
import "../styles/Listado.css";

const ListadoObjetosPerdidos: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<
    "Todos" | "Perdido" | "Encontrado"
  >("Todos");
  const navigate = useNavigate();

  useEffect(() => {
    publicacionesApi.obtenerTodas().then(setPublicaciones);
  }, []);

  const formatearFechaAmigable = (fechaString: string) => {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diferenciaMilisegundos = ahora.getTime() - fecha.getTime();
    const diferenciaDias = Math.floor(
      diferenciaMilisegundos / (1000 * 60 * 60 * 24)
    );

    if (diferenciaDias === 0) {
      return `Hoy a las ${fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diferenciaDias === 1) {
      return `Ayer a las ${fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diferenciaDias <= 7) {
      return `Hace ${diferenciaDias} días`;
    } else {
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  const publicacionesFiltradas = publicaciones.filter((pub) => {
    if (filtroTipo === "Todos") return true;
    return pub.tipo === filtroTipo;
  });

  return (
    <div className="listado-container">
      <h1>Listado de objetos perdidos</h1>

      <div className="filtros-switch">
        <button
          onClick={() => setFiltroTipo("Todos")}
          className={`filtro-btn${filtroTipo === "Todos" ? " selected" : ""}`}
        >
          Todos ({publicaciones.length})
        </button>
        <button
          onClick={() => setFiltroTipo("Perdido")}
          className={`filtro-btn${filtroTipo === "Perdido" ? " selected" : ""}`}
        >
          Perdidos ({publicaciones.filter((p) => p.tipo === "Perdido").length})
        </button>
        <button
          onClick={() => setFiltroTipo("Encontrado")}
          className={`filtro-btn${
            filtroTipo === "Encontrado" ? " selected" : ""
          }`}
        >
          Encontrados (
          {publicaciones.filter((p) => p.tipo === "Encontrado").length})
        </button>
      </div>

      {publicacionesFiltradas.length === 0 ? (
        <p>
          No hay publicaciones
          {filtroTipo !== "Todos" ? ` de tipo "${filtroTipo}"` : ""}.
        </p>
      ) : (
        publicacionesFiltradas.map((pub) => {
          const tipoClass =
            pub.tipo === "Perdido"
              ? "perdido"
              : pub.tipo === "Encontrado"
              ? "encontrado"
              : "";
          return (
            <div key={pub.id} className={`card-publicacion ${tipoClass}`}>
              <div className="card-contenido">
                <h2>
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
                    {pub.categoria}
                  </span>
                </h2>
                <p className="fecha-amigable">
                  {pub.fecha_creacion
                    ? formatearFechaAmigable(pub.fecha_creacion)
                    : "Fecha no disponible"}
                </p>
                <p>{pub.descripcion}</p>
                <div className="card-acciones">
                  <button
                    className="boton-detalles"
                    onClick={() => navigate(`/publicacion/${pub.id}`)}
                  >
                    Ver detalles
                  </button>
                  <span
                    className={`estado-publicacion${
                      pub.estado === "Resuelto" ? " resuelto" : ""
                    }`}
                  >
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
