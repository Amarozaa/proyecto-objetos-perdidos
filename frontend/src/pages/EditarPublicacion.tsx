import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { publicacionesApi, authApi } from "../services/api";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { usePostStore } from "../stores/postStore";

const EditarPublicacion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = authApi.getStoredUser();
  const { posts, obtenerPostPorId } = usePostStore();

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
    const fetchPublicacion = async () => {
      if (!id) return;

      try {
        let publicacion = posts.find(p => p.id === id);
        if (!publicacion) publicacion = await obtenerPostPorId(id);
   
        
        // Verificar que el usuario actual sea el dueño de la publicación
        const publicacionUserId = typeof publicacion.usuario_id === 'object' 
          ? (publicacion.usuario_id as any).id || (publicacion.usuario_id as any)._id
          : publicacion.usuario_id;

        if (currentUser?.id !== publicacionUserId) {
          setErrorMsg("No tienes permiso para editar esta publicación");
          setTimeout(() => navigate("/publicaciones"), 2000);
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
      } catch (error) {
        setErrorMsg("Error al cargar la publicación");
        setLoading(false);
      }
    };
    fetchPublicacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, obtenerPostPorId]);

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

    if (!id) return;

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
      await publicacionesApi.actualizar(id, formData as any);
      setSuccessMsg("Publicación actualizada correctamente");
      setTimeout(() => {
        navigate(`/publicacion/${id}`);
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Error al actualizar la publicación");
      }
    }
  };

  const handleCancel = () => {
    navigate(`/publicacion/${id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Publicación
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
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
          />

          <TextField
            fullWidth
            label="Lugar"
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Fecha del suceso"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
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
            margin="normal"
            variant="outlined"
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
            margin="normal"
            variant="outlined"
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
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="No resuelto">No resuelto</MenuItem>
            <MenuItem value="Resuelto">Resuelto</MenuItem>
          </TextField>

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

export default EditarPublicacion;
