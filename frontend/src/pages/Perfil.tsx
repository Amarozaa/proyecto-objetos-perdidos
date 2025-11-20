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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import { displayApi } from "../services/api";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";
import { handleApiError } from "../utils/errorHandler";

const Perfil: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    post,
    postsUsuario,
    obtenerTodasUsuario,
    eliminar,
    obtenerPostPorId,
    setPost,
  } = usePostStore();
  const { selectedUser, obtenerUserPorId } = useUserStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        obtenerTodasUsuario(id);
        obtenerUserPorId(id);
      } catch (error) {
        const apiError = handleApiError(error, "Error cargando el perfil");
        setErrorMsg(apiError.message);
      }
    };
    fetchData();
  }, [id, obtenerTodasUsuario, obtenerUserPorId]);

  const handleDeleteClick = (publicacionId: string) => {
    obtenerPostPorId(publicacionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!post) return;

    try {
      await eliminar(post.id);
      setDeleteDialogOpen(false);
      setPost(null);
      setSuccessMsg("Publicación eliminada correctamente");
      setErrorMsg("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      const apiError = handleApiError(
        error,
        "Error al eliminar la publicación"
      );
      setErrorMsg(apiError.message);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPost(null);
  };

  if (!selectedUser) return <Typography>Cargando usuario...</Typography>;
  if (!postsUsuario) return <Typography>Cargando publicaciones...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}
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
                src={selectedUser.imagen_url || undefined}
                alt="Foto de perfil"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  bgcolor: !selectedUser.imagen_url
                    ? displayApi.getAvatarColor(selectedUser.nombre)
                    : undefined,
                }}
              >
                {!selectedUser.imagen_url &&
                  selectedUser.nombre.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" component="h2">
                {selectedUser.nombre}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Teléfono:</strong>{" "}
                {selectedUser.telefono && selectedUser.telefono.trim() !== ""
                  ? selectedUser.telefono
                  : "No disponible"}
              </Typography>
              <Typography variant="body1">
                <strong>Correo:</strong> {selectedUser.email}
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
          {postsUsuario.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No hay publicaciones todavía
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {postsUsuario.map((pub) => (
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
                        color={displayApi.getCategoriaColor(pub.categoria)}
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
                          onClick={() =>
                            navigate(`/publicacion/${pub.id}/editar`)
                          }
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(pub.id)}
                        >
                          Eliminar
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

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Eliminar publicación?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar esta publicación? Esta acción
            no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Perfil;
