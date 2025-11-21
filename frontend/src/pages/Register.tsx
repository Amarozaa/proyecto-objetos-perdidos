import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
            Únete a nuestra comunidad para ayudar a recuperar y devolver objetos
            perdidos
          </Typography>
        </Box>
      </Box>

      {/* Lado derecho - Register Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          overflowY: "auto",
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
              Crear cuenta
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
              Completa el formulario para registrarte
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
                {errorDetails.length > 0 && (
                  <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                    {errorDetails.map((detalle, idx) => (
                      <li key={idx}>
                        <Typography
                          variant="body2"
                          sx={{ color: "error.main" }}
                        >
                          {detalle}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Nombre"
                  type="text"
                  name="nombre"
                  value={registerData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre completo"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
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
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Teléfono (opcional)"
                  type="tel"
                  name="telefono"
                  value={registerData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: +56912345678"
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
                  value={registerData.password}
                  onChange={handleChange}
                  required
                  placeholder="Mínimo 6 caracteres"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                    },
                  }}
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
                  Crear cuenta
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
                ¿Ya tienes cuenta?{" "}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "primary.main",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Inicia sesión
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
