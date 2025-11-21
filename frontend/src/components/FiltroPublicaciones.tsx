import React from "react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

interface FiltroPublicacionesProps {
  filter: "Todos" | "Perdido" | "Encontrado";
  totalPublicaciones: number;
  perdidosCount: number;
  encontradosCount: number;
  onFiltroChange: (
    _event: React.MouseEvent<HTMLElement>,
    newFiltro: "Todos" | "Perdido" | "Encontrado"
  ) => void;
}

const FiltroPublicaciones: React.FC<FiltroPublicacionesProps> = ({
  filter,
  totalPublicaciones,
  perdidosCount,
  encontradosCount,
  onFiltroChange,
}) => {
  return (
    <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={onFiltroChange}
        aria-label="filtro tipo"
        sx={{
          "& .MuiToggleButton-root": {
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.95rem",
          },
        }}
      >
        <ToggleButton value="Todos">Todos ({totalPublicaciones})</ToggleButton>
        <ToggleButton value="Perdido">Perdidos ({perdidosCount})</ToggleButton>
        <ToggleButton value="Encontrado">
          Encontrados ({encontradosCount})
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default FiltroPublicaciones;
