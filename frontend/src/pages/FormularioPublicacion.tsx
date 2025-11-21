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
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import type { SelectChangeEvent } from "@mui/material/Select";
import { authApi } from "../services/api";
import type { CrearPublicacion } from "../types/types";
import { usePostStore } from "../stores/postStore";
import { handleApiError } from "../utils/errorHandler";

interface FormData {
  titulo: string;
  descripcion: string;
  lugar: string;
  fecha: string;
  tipo: string;
  categoria: string;
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
  });
  const { crear } = usePostStore();

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

      const publicacion: CrearPublicacion = {
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

      await crear(publicacion);
      setErrorMsg("");
      setErrorDetails([]);
      navigate("/publicaciones");
    } catch (error) {
      const apiError = handleApiError(error, "Error al crear la publicación");
      setErrorMsg(apiError.message);
      // Para errores específicos de campos, podría expandirse con validación por campo
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 700,
          mb: 4,
          background: "linear-gradient(45deg, #17635b 30%, #226a63 90%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Crea una publicación
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
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

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Barra superior de color */}
        <Box
          sx={{
            height: 6,
            background: "linear-gradient(90deg, #17635b 0%, #226a63 100%)",
          }}
        />

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          <Stack spacing={3}>
            {/* Título */}
            <Box>
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
                variant="outlined"
              />
            </Box>

            {/* Lugar y Fecha */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                variant="outlined"
              />
              <TextField
                sx={{ flex: 1, minWidth: 200 }}
                label="Fecha del suceso"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: today }}
                data-testid="fecha"
                variant="outlined"
              />
            </Box>

            {/* Tipo y Categoría */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl sx={{ flex: 1, minWidth: 200 }} required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo"
                  data-testid="tipo"
                  sx={{
                    borderRadius: 0.5,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: 0.5,
                    },
                  }}
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
                  sx={{
                    borderRadius: 0.5,
                    "& .MuiOutlinedInput-notchedOutline": {
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
                </Select>
              </FormControl>
            </Box>

            {/* Descripción */}
            <Box>
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                multiline
                rows={5}
                placeholder="Describe el objeto con detalle: características, color, marca, condición, etc."
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.descripcion.length}/500 caracteres (mín 10)`}
                data-testid="descripcion"
                variant="outlined"
              />
            </Box>

            {/* Botón Publicar */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 0.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "none",
              }}
              data-testid="publicar-button"
            >
              Publicar
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Información adicional */}
      <Card
        elevation={0}
        sx={{
          mt: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 0.5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 4,
            background: "linear-gradient(90deg, #17635b 0%, #226a63 100%)",
          }}
        />
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            align="center"
            sx={{ fontWeight: 700, mb: 3, color: "text.primary" }}
          >
            ¿Qué significa el tipo?
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {/* Perdido */}
            <Box
              sx={{
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.5,
                backgroundColor: "action.hover",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "error.light",
                  backgroundColor: "rgba(244, 67, 54, 0.05)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #f44336 0%, #e91e63 100%)",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 0.5, color: "error.main" }}
                  >
                    Perdido
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usa esta opción si perdiste un objeto y deseas que otros te
                    ayuden a recuperarlo. Describe el objeto con detalle para
                    que sea más fácil identificarlo.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Encontrado */}
            <Box
              sx={{
                p: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.5,
                backgroundColor: "action.hover",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "success.light",
                  backgroundColor: "rgba(76, 175, 80, 0.05)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 0.5, color: "success.main" }}
                  >
                    Encontrado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usa esta opción si encontraste un objeto y quieres ayudar a
                    su propietario a recuperarlo. Incluye todos los detalles que
                    observaste para facilitar la identificación.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default FormularioPublicacion;
