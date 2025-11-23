import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            fontSize: "6rem",
            background: "linear-gradient(45deg, #17635b 30%, #226a63 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
          }}
        >
          Página no encontrada
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontSize: "1.1rem",
            mb: 4,
            maxWidth: "500px",
          }}
        >
          Lo sentimos, la página que buscas no existe o ha sido movida. Por favor, regresa al inicio.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/publicaciones")}
          sx={{
            borderRadius: 0.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            px: 4,
            py: 1.5,
          }}
        >
          Volver al listado
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
