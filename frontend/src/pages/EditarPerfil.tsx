import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApi } from "../services/api";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserStore } from "../stores/userStore";

const EditarPerfil: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users, obtenerUserPorId, actualizar } = useUserStore();
  const currentUser = authApi.getStoredUser();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!id) return;

      // Verificar que el usuario actual puede editar este perfil
      if (currentUser?.id !== id) {
        setErrorMsg("No tienes permiso para editar este perfil");
        setTimeout(() => navigate("/publicaciones"), 2000);
        return;
      }

      try {
        let usuario = users.find((u) => u.id === id);
        if (!usuario) usuario = await obtenerUserPorId(id);
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
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!id) return;

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

      const usuarioActualizado = await actualizar(id, datosActualizados);

      // Actualizar usuario en localStorage
      authApi.setCurrentUser(usuarioActualizado);

      setSuccessMsg("Perfil actualizado correctamente");
      setTimeout(() => {
        navigate(`/perfil/${id}`);
      }, 1500);
    } catch (_error) {
      const errorData = _error as { response?: { data?: { error?: string } } };
      if (errorData.response?.data?.error) {
        setErrorMsg(errorData.response.data.error);
      } else {
        setErrorMsg("Error al actualizar el perfil");
      }
    }
  };

  const handleCancel = () => {
    navigate(`/perfil/${id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Perfil
        </Typography>

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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            helperText="Opcional"
          />

          <TextField
            fullWidth
            label="Nueva Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            helperText="Déjalo en blanco si no quieres cambiarla (mínimo 6 caracteres)"
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Guardar Cambios
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditarPerfil;
