import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";
import { useUserStore } from "../stores/userStore";
import { handleApiError } from "../utils/errorHandler";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { crear } = useUserStore();

  const [registerData, setRegisterData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
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

    if (registerData.password !== registerData.confirm_password) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }
    try {
      await crear({
        nombre: registerData.nombre,
        email: registerData.email,
        password: registerData.password,
        telefono: registerData.telefono,
      });
      alert("¡Se ha creado la cuenta exitosamente!");
      navigate("/login");
    } catch (error) {
      const apiError = handleApiError(error, "Error al registrarse");
      setErrorMsg(apiError.message);
    }
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          textAlign: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          ObjetosUni
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          ¡Regístrate!
        </Typography>
        {errorMsg && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMsg}
            {errorDetails.length > 0 && (
              <Box component="ul" sx={{ mt: 1, pl: 2, textAlign: "left" }}>
                {errorDetails.map((detalle, idx) => (
                  <li key={idx}>{detalle}</li>
                ))}
              </Box>
            )}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre"
            type="text"
            name="nombre"
            value={registerData.nombre}
            onChange={handleChange}
            required
            placeholder="Tu nombre completo"
            margin="normal"
            InputLabelProps={{ required: false }}
          />
          <TextField
            fullWidth
            label="Correo"
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleChange}
            required
            placeholder="ejemplo@correo.com"
            margin="normal"
            InputLabelProps={{ required: false }}
          />
          <TextField
            fullWidth
            label="Teléfono (opcional)"
            type="tel"
            name="telefono"
            value={registerData.telefono}
            onChange={handleChange}
            placeholder="Ej: +56912345678"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleChange}
            required
            placeholder="Mínimo 6 caracteres"
            margin="normal"
            InputLabelProps={{ required: false }}
          />
          <TextField
            fullWidth
            label="Confirmar contraseña"
            type="password"
            name="confirm_password"
            value={registerData.confirm_password}
            onChange={handleChange}
            required
            placeholder="Repite la contraseña"
            margin="normal"
            InputLabelProps={{ required: false }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            Crear cuenta
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            ¿Ya tienes cuenta?{" "}
            <MuiLink component={Link} to="/login" underline="hover">
              Ingresar
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
