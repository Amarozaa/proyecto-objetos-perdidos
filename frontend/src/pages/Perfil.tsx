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
import Stack from "@mui/material/Stack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { displayApi } from "../services/api";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";
import { handleApiError } from "../utils/errorHandler";
import { formatearFechaPersonalizada } from "../utils/dateFormatter";
import PublicacionDetalleModal from "../components/PublicacionDetalleModal";

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
  const [selectedPublicacionId, setSelectedPublicacionId] = useState<
    string | null
  >(null);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {/* Tarjeta de perfil */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 0.5,
          overflow: "hidden",
          mb: 4,
        }}
      >
        {/* Barra superior de color */}
        <Box
          sx={{
            height: 6,
            background: "linear-gradient(90deg, #17635b 0%, #226a63 100%)",
          }}
        />

        <Box sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 4,
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            {/* Avatar y nombre */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 0,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  bgcolor: displayApi.getAvatarColor(selectedUser.nombre),
                  fontSize: "3.5rem",
                  fontWeight: 700,
                }}
              >
                {selectedUser.nombre.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, textAlign: "center" }}
              >
                {selectedUser.nombre}
              </Typography>
            </Box>

            {/* Información */}
            <Box sx={{ flex: 1 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Teléfono
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.telefono &&
                    selectedUser.telefono.trim() !== ""
                      ? selectedUser.telefono
                      : "No disponible"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Correo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Botón editar */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/perfil/${id}/editar`)}
              sx={{
                borderRadius: 0.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "none",
                px: 3,
              }}
            >
              Editar Datos
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Mis publicaciones */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: "linear-gradient(45deg, #17635b 30%, #226a63 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Mis Publicaciones
        </Typography>

        {postsUsuario.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 0.5,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No hay publicaciones todavía
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {postsUsuario.map((pub) => (
              <Card
                key={pub.id}
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 0.5,
                  overflow: "hidden",
                  transition: "border-color 0.3s ease",
                  "&:hover": {
                    borderColor:
                      pub.tipo === "Perdido" ? "error.light" : "success.light",
                  },
                }}
              >
                {/* Barra superior de color según tipo */}
                <Box
                  sx={{
                    height: 6,
                    background:
                      pub.tipo === "Perdido"
                        ? "linear-gradient(90deg, #f44336 0%, #e91e63 100%)"
                        : "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
                  }}
                />

                <CardContent sx={{ p: 3 }}>
                  {/* Header con título y chips */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mb: 2,
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          color: "text.primary",
                        }}
                      >
                        {pub.titulo}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {pub.fecha_creacion
                          ? displayApi.formatearFechaAmigable(
                              pub.fecha_creacion
                            )
                          : "Fecha no disponible"}
                      </Typography>
                    </Box>

                    {/* Chips de categoría y tipo */}
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={pub.categoria}
                        color={displayApi.getCategoriaColor(pub.categoria)}
                        size="medium"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={pub.tipo}
                        color={pub.tipo === "Perdido" ? "error" : "success"}
                        variant="outlined"
                        size="medium"
                        sx={{ fontWeight: 600 }}
                      />
                    </Stack>
                  </Box>

                  {/* Descripción */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {pub.descripcion}
                  </Typography>

                  {/* Info adicional: Lugar, Fecha y botones */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      p: 2,
                      backgroundColor: "action.hover",
                      borderRadius: 0.5,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {pub.lugar}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: 18, color: "primary.main" }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {formatearFechaPersonalizada(pub.fecha)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Botones de acción */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={() => setSelectedPublicacionId(pub.id)}
                        sx={{
                          py: 1,
                          px: 3,
                          borderRadius: 0.5,
                          textTransform: "none",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          boxShadow: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Ver detalles
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate(`/publicacion/${pub.id}/editar`)
                        }
                        data-testid={`editar-publicacion-${pub.id}`}
                        sx={{
                          py: 1,
                          px: 3,
                          borderRadius: 0.5,
                          textTransform: "none",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(pub.id)}
                        data-testid={`eliminar-publicacion-${pub.id}`}
                        sx={{
                          py: 1,
                          px: 3,
                          borderRadius: 0.5,
                          textTransform: "none",
                          fontSize: "0.95rem",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 0.5,
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "text.primary",
          }}
        >
          ¿Eliminar publicación?
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "text.secondary", mt: 1 }}
          >
            ¿Estás seguro de que deseas eliminar esta publicación? Esta acción
            no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderRadius: 0.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            data-testid="confirmar-eliminar-button"
            sx={{
              borderRadius: 0.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {selectedPublicacionId && (
        <PublicacionDetalleModal
          open={!!selectedPublicacionId}
          onClose={() => setSelectedPublicacionId(null)}
          publicacionId={selectedPublicacionId}
        />
      )}
    </Container>
  );
};

export default Perfil;
