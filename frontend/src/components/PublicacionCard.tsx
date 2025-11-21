import React from "react";
import { useNavigate } from "react-router-dom";
import { displayApi } from "../services/api";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { Publicacion, Usuario } from "../types/types";

interface PublicacionCardProps {
  publicacion: Publicacion;
  usuario?: Usuario;
  formatearFechaPersonalizada: (fecha: string) => string;
}

const PublicacionCard: React.FC<PublicacionCardProps> = ({
  publicacion: pub,
  usuario,
  formatearFechaPersonalizada,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
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
        {/* Header con título y categoría */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 2,
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "text.primary",
              }}
            >
              {pub.titulo}
            </Typography>

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

          {/* Chips de categoría y tipo */}
          <Stack direction="row" spacing={1}>
            <Chip
              label={pub.categoria}
              color={displayApi.getCategoriaColor(pub.categoria)}
              size="medium"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={pub.tipo}
              color={pub.tipo === "Perdido" ? "error" : "success"}
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
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
              <LocationOnIcon sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {pub.lugar}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: 18, color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatearFechaPersonalizada(pub.fecha)}
              </Typography>
            </Box>
          </Box>

          {/* Botón de acción */}
          <Button
            variant="contained"
            onClick={() => navigate(`/publicacion/${pub.id}`)}
            sx={{
              py: 1,
              px: 3,
              borderRadius: 0.5,
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              boxShadow: "none",
              whiteSpace: "nowrap",
            }}
          >
            Ver detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PublicacionCard;
