import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";
import PublicacionCard from "../components/PublicacionCard";
import FiltroPublicaciones from "../components/FiltroPublicaciones";
import { formatearFechaPersonalizada } from "../utils/dateFormatter";

const ListadoObjetosPerdidos: React.FC = () => {
  const { posts, filter, obtenerTodas, setFilter } = usePostStore();
  const { users, obtenerTodos } = useUserStore();

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

  const obtenerUsuario = (usuarioId: string) => {
    let userId = usuarioId;
    if (typeof userId === "object") {
      const obj = userId as Record<string, unknown>;
      userId = (obj.id as string) || (obj._id as string);
    }
    return users.find((u) => u.id === userId);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 700,
          mb: 4,
          background: "linear-gradient(45deg, #17635b 30%, #226a63 90%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Objetos Perdidos y Encontrados
      </Typography>

      <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <FiltroPublicaciones
          filter={filter}
          totalPublicaciones={posts.length}
          perdidosCount={posts.filter((p) => p.tipo === "Perdido").length}
          encontradosCount={posts.filter((p) => p.tipo === "Encontrado").length}
          onFiltroChange={handleFiltroChange}
        />
      </Box>

      {publicacionesFiltradas.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No hay publicaciones
            {filter !== "Todos" ? ` de tipo "${filter}"` : ""}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {publicacionesFiltradas.map((pub) => (
            <PublicacionCard
              key={pub.id}
              publicacion={pub}
              usuario={obtenerUsuario(pub.usuario_id)}
              formatearFechaPersonalizada={formatearFechaPersonalizada}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ListadoObjetosPerdidos;
