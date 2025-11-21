import React, { useEffect } from "react";
import { displayApi } from "../services/api";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";

interface PublicacionDetalleModalProps {
  open: boolean;
  onClose: () => void;
  publicacionId: string;
}

const PublicacionDetalleModal: React.FC<PublicacionDetalleModalProps> = ({
  open,
  onClose,
  publicacionId,
}) => {
  const { post, obtenerPostPorId } = usePostStore();
  const { selectedUser, obtenerUserPorId, setUser } = useUserStore();

  useEffect(() => {
    if (!open || !publicacionId) return;
    (async () => {
      try {
        const data = await obtenerPostPorId(publicacionId);
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
  }, [open, publicacionId, obtenerPostPorId, obtenerUserPorId, setUser]);

  const obtenerTextoSegunTipo = () => {
    if (!post) return { accion: "" };

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

  if (!post) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0.5,
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>Cargando...</Typography>
        </Box>
      </Dialog>
    );
  }

  const textos = obtenerTextoSegunTipo();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0.5,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Barra superior de color según tipo */}
      <Box
        sx={{
          height: 6,
          background:
            post.tipo === "Perdido"
              ? "linear-gradient(90deg, #f44336 0%, #e91e63 100%)"
              : "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
        }}
      />

      {/* Header con título y botón cerrar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          p: 3,
          pb: 1,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            maxWidth: "calc(100% - 40px)",
            wordBreak: "break-word",
          }}
        >
          {post.titulo}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            ml: 1,
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 1 }}>
        {/* Info de usuario */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {post.fecha_creacion
              ? displayApi.formatearFechaAmigable(post.fecha_creacion)
              : "No disponible"}
          </Typography>

          {selectedUser && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: displayApi.getAvatarColor(selectedUser.nombre),
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {selectedUser.nombre.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedUser.nombre}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedUser.email}
                </Typography>
              </Box>
              <IconButton
                href={`mailto:${selectedUser.email}`}
                size="small"
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Divider */}
        <Box sx={{ borderBottom: "1px solid", borderColor: "divider", mb: 3 }} />

        {/* Chips de tipo y estado */}
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip
            label={post.tipo}
            color={post.tipo === "Perdido" ? "error" : "success"}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            label={post.categoria}
            color={displayApi.getCategoriaColor(post.categoria)}
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        {/* Info adicional: Lugar y Fecha */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 3,
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 0.5,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <LocationOnIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                {textos.accion}
              </Typography>
              <Typography variant="body2">{post.lugar}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 20, color: "primary.main" }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
                Cuando:
              </Typography>
              <Typography variant="body2">
                {new Date(post.fecha).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Descripción */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Descripción:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            {post.descripcion}
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Button
          variant="contained"
          fullWidth
          onClick={onClose}
          sx={{
            borderRadius: 0.5,
            textTransform: "none",
            fontWeight: 600,
            py: 1.2,
          }}
        >
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PublicacionDetalleModal;
