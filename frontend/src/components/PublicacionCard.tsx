import React from "react";
import { useNavigate } from "react-router-dom";
import { displayApi } from "../services/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Publicacion, Usuario } from "../types/types";

interface PublicacionCardProps {
  publicacion: Publicacion;
  usuario?: Usuario;
  formatearFechaPersonalizada: (fecha: string) => string;
  onVerDetalles?: () => void;
}

const PublicacionCard: React.FC<PublicacionCardProps> = ({
  publicacion: pub,
  usuario,
  formatearFechaPersonalizada,
  onVerDetalles,
}) => {
  const navigate = useNavigate();

  const handleVerDetalles = () => {
    if (onVerDetalles) {
      onVerDetalles();
    } else {
      navigate(`/publicacion/${pub.id}`);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 0.5,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        transition: "border-color 0.3s ease",
        "&:hover": {
          borderColor: pub.tipo === "Perdido" ? "error.light" : "success.light",
        },
      }}
    >
      {/* Barra superior de color según tipo */}
      <Box
        sx={{
          height: 6,
          background:
            pub.tipo === "Perdido"
              ? "linear-gradient(90deg, #f44336 0%, #e91e63 100%)"
              : "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
        }}
      />

      <CardContent sx={{ p: 3 }}>
        {/* Header con título, categoría y tipo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Título y categoría en la misma línea */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {pub.titulo}
              </Typography>
              <Chip
                label={pub.categoria}
                color={displayApi.getCategoriaColor(pub.categoria)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>

            {/* Info del usuario */}
            {usuario && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: displayApi.getAvatarColor(usuario.nombre),
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {usuario.nombre.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {usuario.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pub.fecha_creacion
                    ? displayApi.formatearFechaAmigable(pub.fecha_creacion)
                    : "Fecha no disponible"}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Chip de tipo solo (arriba a la derecha) */}
          <Chip
            label={pub.tipo}
            color={pub.tipo === "Perdido" ? "error" : "success"}
            variant="outlined"
            size="medium"
            sx={{ fontWeight: 600, ml: 2 }}
          />
        </Box>

        {/* Info adicional: Lugar y Fecha */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 2,
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 0.5,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatearFechaPersonalizada(pub.fecha)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {pub.lugar}
              </Typography>
            </Box>
          </Box>

          {/* Botón de acción */}
          <Tooltip title="Ver detalles">
            <IconButton
              onClick={handleVerDetalles}
              sx={{
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PublicacionCard;
