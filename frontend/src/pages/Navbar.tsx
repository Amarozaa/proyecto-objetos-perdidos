import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import SearchIcon from "@mui/icons-material/Search";
import { useUserStore } from "../stores/userStore";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const currentUser = authApi.getStoredUser();
  const userId = currentUser?.id;
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    // logout() de userStore se encarga de:
    // 1. Llamar al backend para cerrar sesión
    // 2. Limpiar localStorage (user y csrfToken)
    // 3. Limpiar el estado de Zustand
    await logout();
    navigate("/login", { replace: true });
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
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
                <SearchIcon sx={{ fontSize: "2.25rem" }} />
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
              onClick={handleLogoutClick}
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

      {/* Modal de confirmación de logout */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: 0.5,
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
          ¿Cerrar sesión?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary", mt: 1 }}>
            ¿Estás seguro de que deseas cerrar sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleLogoutCancel}
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
            onClick={handleLogoutConfirm}
            variant="contained"
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
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Navbar;
