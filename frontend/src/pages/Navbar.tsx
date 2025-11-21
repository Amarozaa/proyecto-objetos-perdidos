import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { useUserStore } from "../stores/userStore";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const currentUser = authApi.getStoredUser();
  const userId = currentUser?.id;

  const handleLogout = async () => {
    // logout() de userStore se encarga de:
    // 1. Llamar al backend para cerrar sesión
    // 2. Limpiar localStorage (user y csrfToken)
    // 3. Limpiar el estado de Zustand
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 2,
        mb: 2,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo y nombre */}
          <Link to="/publicaciones" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                disableRipple
                sx={{
                  p: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <img
                  src="/images/local/buscar.png"
                  alt="Logo"
                  style={{ width: 36, height: 36 }}
                />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                ObjetosUni
              </Typography>
            </Box>
          </Link>

          {/* Navegación derecha */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Botones de navegación */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                component={Link}
                to="/publicaciones"
                sx={{
                  color:
                    location.pathname === "/publicaciones"
                      ? "primary.main"
                      : "text.primary",
                  fontWeight:
                    location.pathname === "/publicaciones" ? 600 : 500,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  backgroundColor:
                    location.pathname === "/publicaciones"
                      ? "action.selected"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Publicaciones
              </Button>
              <Button
                component={Link}
                to="/formulario"
                sx={{
                  color:
                    location.pathname === "/formulario"
                      ? "primary.main"
                      : "text.primary",
                  fontWeight: location.pathname === "/formulario" ? 600 : 500,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  backgroundColor:
                    location.pathname === "/formulario"
                      ? "action.selected"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Publicar
              </Button>
              <Button
                component={Link}
                to={`/perfil/${userId}`}
                sx={{
                  color: location.pathname.startsWith("/perfil")
                    ? "primary.main"
                    : "text.primary",
                  fontWeight: location.pathname.startsWith("/perfil")
                    ? 600
                    : 500,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  backgroundColor: location.pathname.startsWith("/perfil")
                    ? "action.selected"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Perfil
              </Button>
            </Box>

            {/* Botón logout */}
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: "none",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  boxShadow: "none",
                },
              }}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
