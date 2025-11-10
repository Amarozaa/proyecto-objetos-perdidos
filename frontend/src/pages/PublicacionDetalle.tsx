import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { publicacionesApi, usuariosApi } from "../services/api";
import type { Publicacion, Usuario } from "../types/types";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";

const PublicacionDetalle: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    if (id) {
      publicacionesApi
        .obtenerPorId(id)
        .then((data) => {
          setPublicacion(data);
          if (data.usuario_id) {
            let usuarioId = data.usuario_id;
            if (typeof usuarioId === "object") {
              const obj = usuarioId as Record<string, unknown>;
              usuarioId = (obj.id as string) || (obj._id as string);
            }
            usuariosApi
              .obtenerPorId(usuarioId)
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

  const obtenerTextoSegunTipo = () => {
    if (!publicacion) return { accion: "", icono: "" };

    if (publicacion.tipo === "Perdido") {
      return {
        accion: "Perdido en:",
      };
    } else {
      return {
        accion: "Encontrado en:",
      };
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

  const handleVolver = () => {
    const state = location.state as { from?: string; userId?: string } | null;
    if (state?.from === "perfil" && state.userId) {
      navigate(`/perfil/${state.userId}`);
    } else {
      navigate("/publicaciones");
    }
  };

  if (!publicacion) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="body1">No se encontró la publicación.</Typography>
        <Button variant="contained" onClick={handleVolver} sx={{ mt: 2 }}>
          Volver al listado
        </Button>
      </Container>
    );
  }

  const textos = obtenerTextoSegunTipo();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {publicacion.titulo}
      </Typography>

      <Card sx={{ borderRadius: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {publicacion.fecha_creacion
                ? formatearFechaAmigable(publicacion.fecha_creacion)
                : "No disponible"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                <strong>Por:</strong>
              </Typography>
              {usuario ? (
                <>
                  <Avatar
                    src={usuario.imagen_url || undefined}
                    sx={{
                      width: 24,
                      height: 24,
                      mr: 1,
                      bgcolor: !usuario.imagen_url
                        ? getAvatarColor(usuario.nombre)
                        : undefined,
                      fontSize: 12,
                    }}
                  >
                    {!usuario.imagen_url &&
                      usuario.nombre.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {usuario.nombre}
                  </Typography>
                  <IconButton
                    href={`mailto:${usuario.email}`}
                    size="small"
                    sx={{ p: 0 }}
                  >
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Typography variant="body1">Cargando usuario...</Typography>
              )}
            </Box>

            <Box sx={{ my: 2 }} />

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{textos.accion}</strong> {publicacion.lugar}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Tipo:</strong> {publicacion.tipo}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Fecha del suceso:</strong>{" "}
              {new Date(publicacion.fecha).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Descripción:</strong> {publicacion.descripcion}
            </Typography>
          </CardContent>

          <CardMedia
            component="div"
            sx={{
              width: 300,
              height: 400,
              backgroundColor: "#bfbfbf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 2,
              mr: 2,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Chip
                label={publicacion.categoria}
                color={getCategoriaColor(publicacion.categoria)}
                size="small"
              />
              <Chip
                label={publicacion.estado}
                color={publicacion.estado === "Resuelto" ? "success" : "error"}
                size="small"
              />
            </Box>
            {publicacion.imagen_url ? (
              <Box
                component="img"
                src={publicacion.imagen_url}
                alt={publicacion.titulo}
                sx={{
                  maxWidth: 250,
                  maxHeight: 250,
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Imagen
              </Typography>
            )}
          </CardMedia>
        </Box>
      </Card>
    </Container>
  );
};

export default PublicacionDetalle;
