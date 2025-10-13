import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error('Error:', error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "ID mal formateado" });
  }

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  if (error.code === 11000) {
    return response.status(400).json({
      error: "El username o email ya está registrado"
    });
  }

  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Token inválido" });
  }

  if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "Token expirado" });
  }

  response.status(500).json({ error: "Error interno del servidor" });
};

export default errorHandler;
