import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useUserStore } from "../stores/userStore";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore();
  const currentUser = authApi.getStoredUser();
  const userId = currentUser?.id;

  const handleLogout = async () => {
    try {
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1em 1.2em",
        marginTop: 1,
        minHeight: 52,
        backgroundColor: "background.paper",
        border: "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
        <IconButton edge="start" sx={{ mr: 1, p: 0.3 }}>
          <img
            src="/images/local/buscar.png"
            alt="Logo"
            style={{ width: 32, height: 32 }}
          />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: "primary.main", fontWeight: "bold" }}
        >
          ObjetosUni
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          component={Link}
          to="/publicaciones"
          sx={{
            color:
              location.pathname === "/publicaciones"
                ? "primary.main"
                : "text.primary",
            fontWeight:
              location.pathname === "/publicaciones" ? "bold" : "normal",
            mx: 1,
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
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
            fontWeight: location.pathname === "/formulario" ? "bold" : "normal",
            mx: 1,
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
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
              ? "bold"
              : "normal",
            mx: 1,
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
          }}
        >
          Perfil
        </Button>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            ml: 2,
            borderRadius: 2,
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
