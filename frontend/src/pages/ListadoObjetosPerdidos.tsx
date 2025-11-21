import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { displayApi } from "../services/api";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Avatar from "@mui/material/Avatar";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";

const ListadoObjetosPerdidos: React.FC = () => {
  const { posts, filter, obtenerTodas, setFilter } = usePostStore();
  const { users, obtenerTodos } = useUserStore();
  const navigate = useNavigate();

  // Obtener publicaciones
  useEffect(() => {
    obtenerTodas();
    obtenerTodos();
  }, []);

  const publicacionesFiltradas = posts.filter((pub) => {
    if (filter === "Todos") return true;
    return pub.tipo === filter;
  });

  const handleFiltroChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFiltro: "Todos" | "Perdido" | "Encontrado"
  ) => {
    if (newFiltro !== null) {
      setFilter(newFiltro);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Listado de objetos perdidos
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFiltroChange}
          aria-label="filtro tipo"
        >
          <ToggleButton value="Todos">Todos ({posts.length})</ToggleButton>
          <ToggleButton value="Perdido">
            Perdidos ({posts.filter((p) => p.tipo === "Perdido").length})
          </ToggleButton>
          <ToggleButton value="Encontrado">
            Encontrados ({posts.filter((p) => p.tipo === "Encontrado").length})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {publicacionesFiltradas.length === 0 ? (
        <Typography variant="body1" align="center">
          No hay publicaciones
          {filter !== "Todos" ? ` de tipo "${filter}"` : ""}.
        </Typography>
      ) : (
        publicacionesFiltradas.map((pub) => (
          <Card
            key={pub.id}
            sx={{
              mb: 2,
              borderRadius: 1,
              backgroundColor: pub.tipo === "Perdido" ? "#fff0f0" : "#f0fff4",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                    {pub.titulo}
                  </Typography>
                  <Chip
                    label={pub.categoria}
                    color={displayApi.getCategoriaColor(pub.categoria)}
                    size="small"
                  />
                </Box>
                {(() => {
                  let userId = pub.usuario_id;
                  if (typeof userId === "object") {
                    const obj = userId as Record<string, unknown>;
                    userId = (obj.id as string) || (obj._id as string);
                  }
                  const user = users.find((u) => u.id === userId);
                  return user ? (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          bgcolor: displayApi.getAvatarColor(user.nombre),
                          fontSize: 12,
                        }}
                      >
                        {user.nombre.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {user.nombre}
                      </Typography>
                    </Box>
                  ) : null;
                })()}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {pub.fecha_creacion
                    ? displayApi.formatearFechaAmigable(pub.fecha_creacion)
                    : "Fecha no disponible"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {pub.descripcion}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/publicacion/${pub.id}`)}
                  >
                    Ver detalles
                  </Button>
                  <Chip
                    label={pub.estado}
                    color={pub.estado === "Resuelto" ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </CardContent>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: "#e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  ml: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {pub.categoria}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ListadoObjetosPerdidos;
