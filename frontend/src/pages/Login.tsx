import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../services/api";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import { useUserStore } from "../stores/userStore";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();

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
      login(data);

      authApi.setCurrentUser(data);
      navigate("/publicaciones");
    } catch {
      setErrorMsg("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {/* Lado izquierdo - Branding */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 6,
          background: "linear-gradient(135deg, #17635b 0%, #226a63 100%)",
          color: "white",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            mb: 3,
            fontSize: "3rem",
          }}
        >
          <SearchIcon sx={{ fontSize: "3rem" }} />
        </Avatar>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "white",
            }}
          >
            ObjetosUni
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            La plataforma que te permite publicar sobre objetos perdidos o
            encontrados dentro de la facultad
          </Typography>
        </Box>
      </Box>

      {/* Lado derecho - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 400,
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

          <Box sx={{ p: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Inicia sesión
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              align="center"
              sx={{
                color: "text.secondary",
                mb: 3,
              }}
            >
              Ingresa con tu cuenta para continuar
            </Typography>

            {errorMsg && (
              <Box
                sx={{
                  mb: 3,
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "error.light",
                  borderRadius: 0.5,
                  backgroundColor: "rgba(244, 67, 54, 0.05)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "error.main",
                    fontWeight: 500,
                  }}
                >
                  {errorMsg}
                </Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                  placeholder="ejemplo@correo.com"
                  data-testid="email"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  data-testid="password"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  data-testid="login-button"
                  sx={{
                    py: 1.5,
                    borderRadius: 0.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: "none",
                    mt: 1,
                  }}
                >
                  Ingresar
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" align="center" color="text.secondary">
                ¿No tienes cuenta?{" "}
                <MuiLink
                  component={Link}
                  to="/register"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "primary.main",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Regístrate aquí
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
