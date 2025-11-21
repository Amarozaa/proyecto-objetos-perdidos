import React, { useState, useEffect } from "react";
import { authApi } from "../services/api";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { usePostStore } from "../stores/postStore";
import { handleApiError } from "../utils/errorHandler";

interface EditarPublicacionModalProps {
  open: boolean;
  onClose: () => void;
  publicacionId: string;
}

const EditarPublicacionModal: React.FC<EditarPublicacionModalProps> = ({
  open,
  onClose,
  publicacionId,
}) => {
  const currentUser = authApi.getStoredUser();
  const { posts, obtenerPostPorId, actualizar } = usePostStore();

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    lugar: "",
    fecha: "",
    tipo: "Perdido",
    categoria: "Otros",
    estado: "No resuelto",
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    if (!open || !publicacionId) {
      setLoading(true);
      return;
    }

    const fetchPublicacion = async () => {
      try {
        let publicacion = posts.find((p) => p.id === publicacionId);
        if (!publicacion) publicacion = await obtenerPostPorId(publicacionId);

        // Verificar que el usuario actual sea el dueño de la publicación
        const publicacionUserId =
          typeof publicacion.usuario_id === "object"
            ? ((publicacion.usuario_id as { id?: string; _id?: string }) || {})
                .id ||
              ((publicacion.usuario_id as { id?: string; _id?: string }) || {})
                ._id
            : publicacion.usuario_id;

        if (currentUser?.id !== publicacionUserId) {
          setErrorMsg("No tienes permiso para editar esta publicación");
          return;
        }

        setFormData({
          titulo: publicacion.titulo || "",
          descripcion: publicacion.descripcion || "",
          lugar: publicacion.lugar || "",
          fecha: publicacion.fecha || "",
          tipo: publicacion.tipo || "Perdido",
          categoria: publicacion.categoria || "Otros",
          estado: publicacion.estado || "No resuelto",
        });
        setLoading(false);
      } catch {
        setErrorMsg("Error al cargar la publicación");
        setLoading(false);
      }
    };
    fetchPublicacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, publicacionId, obtenerPostPorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validaciones básicas
    if (formData.titulo.trim().length < 3) {
      setErrorMsg("El título debe tener al menos 3 caracteres");
      return;
    }

    if (formData.descripcion.trim().length < 10) {
      setErrorMsg("La descripción debe tener al menos 10 caracteres");
      return;
    }

    try {
      await actualizar(
        publicacionId,
        formData as Partial<{
          titulo: string;
          descripcion: string;
          lugar: string;
          fecha: string;
          tipo: "Perdido" | "Encontrado";
          categoria:
            | "Electrónicos"
            | "Ropa"
            | "Documentos"
            | "Accesorios"
            | "Deportes"
            | "Útiles"
            | "Otros";
          estado: "Resuelto" | "No resuelto";
        }>
      );
      setSuccessMsg("Publicación actualizada correctamente");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (_error) {
      const error = handleApiError(
        _error,
        "Error al actualizar la publicación"
      );
      setErrorMsg(error.message);
    }
  };

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
      {/* Barra superior de color */}
      <Box
        sx={{
          height: 6,
          background: "linear-gradient(90deg, #17635b 0%, #226a63 100%)",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          pb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Editar Publicación
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 0.5 }}>
                {errorMsg}
              </Alert>
            )}

            {successMsg && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 0.5 }}>
                {successMsg}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Título"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  data-testid="titulo-edit"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  multiline
                  rows={3}
                  size="small"
                  data-testid="descripcion-edit"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Lugar"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Cuando"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  select
                  label="Tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                >
                  <MenuItem value="Perdido">Perdido</MenuItem>
                  <MenuItem value="Encontrado">Encontrado</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Categoría"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                >
                  <MenuItem value="Electrónicos">Electrónicos</MenuItem>
                  <MenuItem value="Ropa">Ropa</MenuItem>
                  <MenuItem value="Documentos">Documentos</MenuItem>
                  <MenuItem value="Accesorios">Accesorios</MenuItem>
                  <MenuItem value="Deportes">Deportes</MenuItem>
                  <MenuItem value="Útiles">Útiles</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                >
                  <MenuItem value="No resuelto">No resuelto</MenuItem>
                  <MenuItem value="Resuelto">Resuelto</MenuItem>
                </TextField>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: 0.5,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.2,
                    }}
                    data-testid="guardar-cambios-button"
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={onClose}
                    sx={{
                      borderRadius: 0.5,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.2,
                    }}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditarPublicacionModal;
