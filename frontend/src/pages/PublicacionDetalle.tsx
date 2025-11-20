import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { displayApi } from "../services/api";
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
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";

const PublicacionDetalle: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { post, obtenerPostPorId } = usePostStore();
  const { selectedUser, obtenerUserPorId, setUser } = useUserStore();
  //const [autor, setAutor] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await obtenerPostPorId(id);
        if (!data || !data.usuario_id) {
          setUser(null);
          return;
        }
        const usuarioId =
          typeof data.usuario_id === "object"
            ? ((data.usuario_id as { id?: string; _id?: string }) || {}).id ||
              ((data.usuario_id as { id?: string; _id?: string }) || {})._id
            : data.usuario_id;
        if (usuarioId) {
          obtenerUserPorId(usuarioId);
        }
      } catch (err) {
        console.error("Error cargando publicación o usuario:", err);
        setUser(null);
      }
    })();
  }, [id, obtenerPostPorId, obtenerUserPorId, setUser]);


  const obtenerTextoSegunTipo = () => {
    if (!post) return { accion: "", icono: "" };

    if (post.tipo === "Perdido") {
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

  if (!post) {
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
        {post.titulo}
      </Typography>

      <Card sx={{ borderRadius: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {post.fecha_creacion
                ? displayApi.formatearFechaAmigable(post.fecha_creacion)
                : "No disponible"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body1" sx={{ mr: 1 }}>
                <strong>Por:</strong>
              </Typography>
              {selectedUser ? (
                <>
                  <Avatar
                    src={selectedUser.imagen_url || undefined}
                    sx={{
                      width: 24,
                      height: 24,
                      mr: 1,
                      bgcolor: !selectedUser.imagen_url
                        ? displayApi.getAvatarColor(selectedUser.nombre)
                        : undefined,
                      fontSize: 12,
                    }}
                  >
                    {!selectedUser.imagen_url &&
                      selectedUser.nombre.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    {selectedUser.nombre}
                  </Typography>
                  <IconButton
                    href={`mailto:${selectedUser.email}`}
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
              <strong>{textos.accion}</strong> {post.lugar}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Tipo:</strong> {post.tipo}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Fecha del suceso:</strong>{" "}
              {new Date(post.fecha).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Descripción:</strong> {post.descripcion}
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
                label={post.categoria}
                color={displayApi.getCategoriaColor(post.categoria)}
                size="small"
              />
              <Chip
                label={post.estado}
                color={post.estado === "Resuelto" ? "success" : "error"}
                size="small"
              />
            </Box>
            {post.imagen_url ? (
              <Box
                component="img"
                src={post.imagen_url}
                alt={post.titulo}
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
