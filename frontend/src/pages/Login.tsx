import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const { email, password } = loginData;
      const data = await authApi.login({ email, password });

      authApi.setCurrentUser(data);
      navigate("/publicaciones");
    } catch {
      setErrorMsg("Error al iniciar sesión. Verifica tus credenciales.");
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
        <Typography
          variant="body1"
          gutterBottom
          sx={{ fontSize: "1.4rem", mb: 3 }}
        >
          La plataforma que te permite publicar sobre objetos perdidos o
          encontrados dentro de la facultad
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          ¡Ingresa a tu cuenta!
        </Typography>
        {errorMsg && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMsg}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
            placeholder="ejemplo@correo.com"
            margin="normal"
            InputLabelProps={{ required: false }}
            data-testid="email"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
            margin="normal"
            InputLabelProps={{ required: false }}
            data-testid="password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
            data-testid="login-button"
          >
            Ingresar
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            ¿No tienes cuenta?{" "}
            <MuiLink component={Link} to="/register" underline="hover">
              Regístrate
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
