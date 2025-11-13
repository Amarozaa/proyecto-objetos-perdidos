import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import type { Publicacion, Usuario } from "../types/types";
import { publicacionesApi, usuariosApi, displayApi } from "../services/api";

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

  if (!usuario) return <Typography>Cargando usuario...</Typography>;
  if (!publicaciones) return <Typography>Cargando publicaciones...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Mi Perfil
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={usuario.imagen_url || undefined}
                alt="Foto de perfil"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  bgcolor: !usuario.imagen_url
                    ? getAvatarColor(usuario.nombre)
                    : undefined,
                }}
              >
                {!usuario.imagen_url && usuario.nombre.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" component="h2">
                {usuario.nombre}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Teléfono:</strong>{" "}
                {usuario.telefono && usuario.telefono.trim() !== ""
                  ? usuario.telefono
                  : "No disponible"}
              </Typography>
              <Typography variant="body1">
                <strong>Correo:</strong> {usuario.email}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={() => navigate(`/perfil/${id}/editar`)}
            >
              Editar Datos
            </Button>
          </Paper>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Mis Publicaciones
          </Typography>
          {publicaciones.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No hay publicaciones todavía
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {publicaciones.map((pub) => (
                <Card key={pub.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ flexGrow: 1 }}
                      >
                        {pub.titulo}
                      </Typography>
                      <Chip
                        label={pub.categoria}
                        color={getCategoriaColor(pub.categoria)}
                        size="small"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {pub.fecha_creacion
                        ? displayApi.formatearFechaAmigable(pub.fecha_creacion)
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
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(`/publicacion/${pub.id}`, {
                              state: { from: "perfil", userId: id },
                            })
                          }
                        >
                          Ver Detalles
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => navigate(`/publicacion/${pub.id}/editar`)}
                        >
                          Editar
                        </Button>
                      </Box>
                      <Chip
                        label={pub.estado}
                        color={pub.estado === "Resuelto" ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Perfil;
