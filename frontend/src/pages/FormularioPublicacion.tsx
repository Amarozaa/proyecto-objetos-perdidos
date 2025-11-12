import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import type { SelectChangeEvent } from "@mui/material/Select";
import { authApi, publicacionesApi } from "../services/api";
import type { CrearPublicacion } from "../types/types";

interface FormData {
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  tipo: string;
  categoria: string;
  imagen_url: string;
}

const FormularioPublicacion: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    descripcion: "",
    lugar: "",
    fecha: "",
    tipo: "",
    categoria: "",
    imagen_url: "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setErrorDetails([]);

    if (!authApi.isAuthenticated()) {
      setErrorMsg("Debes iniciar sesión para publicar.");
      return;
    }

    // Validaciones adicionales
    if (formData.titulo.trim().length < 3) {
      setErrorMsg("El título debe tener al menos 3 caracteres.");
      return;
    }
    if (formData.descripcion.trim().length < 10) {
      setErrorMsg("La descripción debe tener al menos 10 caracteres.");
      return;
    }
    const fecha = new Date(formData.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha > hoy) {
      setErrorMsg("La fecha no puede ser futura.");
      return;
    }

    try {
      if (
        !formData.titulo.trim() ||
        !formData.descripcion.trim() ||
        !formData.lugar.trim() ||
        !formData.fecha ||
        !formData.tipo ||
        !formData.categoria
      ) {
        setErrorMsg("Todos los campos son obligatorios.");
        return;
      }

      const publicacionBase: Omit<CrearPublicacion, "imagen_url"> = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        lugar: formData.lugar.trim(),
        fecha: formData.fecha,
        tipo: formData.tipo as "Perdido" | "Encontrado",
        categoria: formData.categoria as
          | "Electrónicos"
          | "Ropa"
          | "Documentos"
          | "Accesorios"
          | "Deportes"
          | "Útiles"
          | "Otros",
      };
      const publicacion: CrearPublicacion =
        formData.imagen_url && formData.imagen_url.trim() !== ""
          ? { ...publicacionBase, imagen_url: formData.imagen_url }
          : publicacionBase;

      await publicacionesApi.crear(publicacion);
      setErrorMsg("");
      setErrorDetails([]);
      navigate("/publicaciones");
    } catch (error) {
      let msg = "Error al crear la publicación. Intenta nuevamente.";
      let detalles: string[] = [];
      interface AxiosError {
        response?: {
          data?: {
            error?: string;
            detalles?: string[];
          };
        };
      }
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        msg = err.response.data.error || msg;
        if (
          err.response.data.detalles &&
          Array.isArray(err.response.data.detalles)
        ) {
          detalles = err.response.data.detalles;
        }
      }
      setErrorMsg(msg);
      setErrorDetails(detalles);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ textAlign: "center" }}
        >
          Crea una publicación
        </Typography>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
            {errorDetails.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {errorDetails.map((detalle, idx) => (
                  <li key={idx}>{detalle}</li>
                ))}
              </ul>
            )}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            fullWidth
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ej: Mochila negra, billetera, celular..."
            inputProps={{ maxLength: 100 }}
            helperText={`${formData.titulo.length}/100 caracteres (mín 3)`}
            data-testid="titulo"
          />
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label="Lugar"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              required
              placeholder="¿Dónde se perdió o encontró?"
              inputProps={{ maxLength: 100 }}
              helperText={`${formData.lugar.length}/100 caracteres`}
              data-testid="lugar"
            />
            <TextField
              sx={{ flex: 1, minWidth: 200 }}
              label="Fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
              data-testid="fecha"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <FormControl sx={{ flex: 1, minWidth: 200 }} required>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                label="Tipo"
                data-testid="tipo"
              >
                <MenuItem value="Perdido">Perdido</MenuItem>
                <MenuItem value="Encontrado">Encontrado</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1, minWidth: 200 }} required>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                label="Categoría"
                data-testid="categoria"
              >
                <MenuItem value="Electrónicos">Electrónicos</MenuItem>
                <MenuItem value="Ropa">Ropa</MenuItem>
                <MenuItem value="Documentos">Documentos</MenuItem>
                <MenuItem value="Accesorios">Accesorios</MenuItem>
                <MenuItem value="Deportes">Deportes</MenuItem>
                <MenuItem value="Útiles">Útiles</MenuItem>
                <MenuItem value="Otros">Otros</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            multiline
            rows={4}
            placeholder="Describe el objeto, características, color, marca, etc."
            inputProps={{ maxLength: 500 }}
            helperText={`${formData.descripcion.length}/500 caracteres (mín 10)`}
            data-testid="descripcion"
          />
          <Typography variant="body1" sx={{ mb: 1 }}>
            Imagen{" "}
            <Typography component="span" sx={{ color: "text.secondary" }}>
              aún no disponible
            </Typography>
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            data-testid="publicar-button"
          >
            Publicar
          </Button>
        </Box>
        <Box sx={{ mt: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            ¿Qué significa el tipo?
          </Typography>
          <Typography component="div">
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
              <li>
                <strong>Perdido:</strong> significa que perdiste un objeto y
                quieres recuperarlo
              </li>
              <li>
                <strong>Encontrado:</strong> significa que encontraste un objeto
                y quieres devolverlo
              </li>
            </ul>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FormularioPublicacion;
