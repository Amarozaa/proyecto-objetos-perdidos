import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicacionesApi, usuariosApi } from "../services/api";
import type { Publicacion, Usuario } from "../types/types";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Avatar from "@mui/material/Avatar";

const ListadoObjetosPerdidos: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [usuarios, setUsuarios] = useState<Record<string, Usuario>>({});
  const [filtroTipo, setFiltroTipo] = useState<
    "Todos" | "Perdido" | "Encontrado"
  >("Todos");
  const navigate = useNavigate();

  useEffect(() => {
    publicacionesApi.obtenerTodas().then(async (pubs) => {
      setPublicaciones(pubs);
      const userIds = pubs
        .map((p) => {
          let uid = p.usuario_id;
          if (typeof uid === "object") {
            const obj = uid as Record<string, unknown>;
            uid = (obj.id as string) || (obj._id as string);
          }
          return uid as string;
        })
        .filter((id, index, arr) => arr.indexOf(id) === index);
      const userPromises = userIds.map((id) => usuariosApi.obtenerPorId(id));
      const users = await Promise.all(userPromises);
      const userMap: Record<string, Usuario> = {};
      users.forEach((u) => (userMap[u.id] = u));
      setUsuarios(userMap);
    });
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

  const handleFiltroChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFiltro: "Todos" | "Perdido" | "Encontrado"
  ) => {
    if (newFiltro !== null) {
      setFiltroTipo(newFiltro);
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Electrónicos":
        return "primary";
      case "Ropa":
        return "secondary";
      case "Documentos":
        return "warning";
      case "Accesorios":
        return "success";
      case "Deportes":
        return "error";
      case "Útiles":
        return "info";
      default:
        return "default";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "#f44336", // red
      "#e91e63", // pink
      "#9c27b0", // purple
      "#673ab7", // deep purple
      "#3f51b5", // indigo
      "#2196f3", // blue
      "#03a9f4", // light blue
      "#00bcd4", // cyan
      "#009688", // teal
      "#4caf50", // green
      "#8bc34a", // light green
      "#cddc39", // lime
      "#ffeb3b", // yellow
      "#ffc107", // amber
      "#ff9800", // orange
      "#ff5722", // deep orange
      "#795548", // brown
      "#9e9e9e", // grey
      "#607d8b", // blue grey
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Listado de objetos perdidos
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={filtroTipo}
          exclusive
          onChange={handleFiltroChange}
          aria-label="filtro tipo"
        >
          <ToggleButton value="Todos">
            Todos ({publicaciones.length})
          </ToggleButton>
          <ToggleButton value="Perdido">
            Perdidos ({publicaciones.filter((p) => p.tipo === "Perdido").length}
            )
          </ToggleButton>
          <ToggleButton value="Encontrado">
            Encontrados (
            {publicaciones.filter((p) => p.tipo === "Encontrado").length})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {publicacionesFiltradas.length === 0 ? (
        <Typography variant="body1" align="center">
          No hay publicaciones
          {filtroTipo !== "Todos" ? ` de tipo "${filtroTipo}"` : ""}.
        </Typography>
      ) : (
        publicacionesFiltradas.map((pub) => (
          <Card
            key={pub.id}
            sx={{
              mb: 2,
              borderRadius: 1,
              backgroundColor: pub.tipo === "Perdido" ? "#fff0f0" : "#f0fff4",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                    {pub.titulo}
                  </Typography>
                  <Chip
                    label={pub.categoria}
                    color={getCategoriaColor(pub.categoria)}
                    size="small"
                  />
                </Box>
                {(() => {
                  let userId = pub.usuario_id;
                  if (typeof userId === "object") {
                    const obj = userId as Record<string, unknown>;
                    userId = (obj.id as string) || (obj._id as string);
                  }
                  const user = usuarios[userId as string];
                  return user ? (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        src={user.imagen_url || undefined}
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: !user.imagen_url
                            ? getAvatarColor(user.nombre)
                            : undefined,
                          fontSize: 12,
                        }}
                      >
                        {!user.imagen_url &&
                          user.nombre.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {user.nombre}
                      </Typography>
                    </Box>
                  ) : null;
                })()}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {pub.fecha_creacion
                    ? formatearFechaAmigable(pub.fecha_creacion)
                    : "Fecha no disponible"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {pub.descripcion}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/publicacion/${pub.id}`)}
                  >
                    Ver detalles
                  </Button>
                  <Chip
                    label={pub.estado}
                    color={pub.estado === "Resuelto" ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardMedia
                component="div"
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: "#bfbfbf",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  ml: 2,
                }}
              >
                {pub.imagen_url ? (
                  <Box
                    component="img"
                    src={pub.imagen_url}
                    alt={pub.titulo}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Sin imagen
                  </Typography>
                )}
              </CardMedia>
            </Box>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ListadoObjetosPerdidos;
