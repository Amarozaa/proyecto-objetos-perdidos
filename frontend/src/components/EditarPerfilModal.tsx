import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserStore } from "../stores/userStore";
import { authApi } from "../services/api";
import { handleApiError } from "../utils/errorHandler";

interface EditarPerfilModalProps {
  open: boolean;
  onClose: () => void;
  usuarioId: string;
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({
  open,
  onClose,
  usuarioId,
}) => {
  const { users, obtenerUserPorId, actualizar } = useUserStore();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!open || !usuarioId) return;

      setLoading(true);
      try {
        let usuario = users.find((u) => u.id === usuarioId);
        if (!usuario) usuario = await obtenerUserPorId(usuarioId);

        setFormData({
          nombre: usuario?.nombre || "",
          email: usuario?.email || "",
          telefono: usuario?.telefono || "",
          password: "",
        });
        setLoading(false);
      } catch {
        setErrorMsg("Error al cargar los datos del usuario");
        setLoading(false);
      }
    };
    fetchUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, usuarioId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Solo enviar campos que no estén vacíos
      const datosActualizados: Partial<{
        nombre: string;
        email: string;
        telefono?: string;
        password?: string;
      }> = {
        nombre: formData.nombre,
        email: formData.email,
      };

      if (formData.telefono.trim()) {
        datosActualizados.telefono = formData.telefono;
      }

      if (formData.password.trim()) {
        if (formData.password.length < 6) {
          setErrorMsg("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        datosActualizados.password = formData.password;
      }

      const usuarioActualizado = await actualizar(usuarioId, datosActualizados);

      // Actualizar usuario en localStorage
      authApi.setCurrentUser(usuarioActualizado);

      setSuccessMsg("Perfil actualizado correctamente");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (_error) {
      const error = handleApiError(_error, "Error al actualizar el perfil");
      setErrorMsg(error.message);
    }
  };

  const handleCancel = () => {
    setErrorMsg("");
    setSuccessMsg("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
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
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          pt: 3,
        }}
      >
        Editar Perfil
      </DialogTitle>

      <DialogContent sx={{ pt: 4, pb: 4 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3, mb: 1 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
              />

              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                variant="outlined"
                size="small"
                helperText="Opcional"
              />

              <TextField
                fullWidth
                label="Nueva Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                helperText="Déjalo en blanco si no quieres cambiarla (mínimo 6 caracteres)"
              />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            py: 0.75,
            px: 2.5,
            borderRadius: 0.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !!successMsg}
          sx={{
            py: 0.75,
            px: 2.5,
            borderRadius: 0.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "none",
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarPerfilModal;
