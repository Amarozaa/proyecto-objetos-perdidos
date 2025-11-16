import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { publicacionesApi, usuariosApi, displayApi } from "../services/api";
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
                ? displayApi.formatearFechaAmigable(publicacion.fecha_creacion)
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
                        ? displayApi.getAvatarColor(usuario.nombre)
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
                color={displayApi.getCategoriaColor(publicacion.categoria)}
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

      <Button variant="contained" onClick={handleVolver} sx={{ mt: 3 }}>
        Volver al listado
      </Button>
    </Container>
  );
};

export default PublicacionDetalle;
