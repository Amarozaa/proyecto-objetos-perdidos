import { Request, Response, NextFunction } from 'express';

interface ErrorWithCode extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

interface MulterError extends Error {
  code?: string;
  field?: string;
}

const errorHandler = (
  error: ErrorWithCode | MulterError,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.error('Error:', error.message);

  // Error de ID mal formateado
  if (error.name === "CastError") {
    response.status(400).json({ error: "ID mal formateado" });
    return;
  }

  // Error de validación de Mongoose
  if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
    return;
  }

  // Error de duplicado en MongoDB
  if ((error as ErrorWithCode).code === 11000) {
    const mongoError = error as ErrorWithCode;
    const campo = mongoError.keyPattern ? Object.keys(mongoError.keyPattern)[0] : 'desconocido';
    
    const mensajes: Record<string, string> = {
      email: 'Ya existe un usuario registrado con este email',
      telefono: 'Ya existe un usuario registrado con este teléfono'
    };
    
    response.status(409).json({
      error: mensajes[campo] || "El username o email ya está registrado",
      campo
    });
    return;
  }

  // Errores de Multer (archivos)
  const multerError = error as MulterError;
  if (multerError.code === 'LIMIT_FILE_SIZE') {
    response.status(400).json({ 
      error: 'El archivo es demasiado grande. Máximo 5MB permitido.' 
    });
    return;
  }

  if (multerError.code === 'LIMIT_UNEXPECTED_FILE') {
    response.status(400).json({ 
      error: 'Campo de archivo no esperado.' 
    });
    return;
  }

  if (error.message.includes('Solo se permiten archivos de imagen')) {
    response.status(400).json({ 
      error: 'Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)' 
    });
    return;
  }

  // Errores de JWT
  if (error.name === "JsonWebTokenError") {
    response.status(401).json({ error: "Token inválido" });
    return;
  }

  if (error.name === "TokenExpiredError") {
    response.status(401).json({ error: "Token expirado" });
    return;
  }

  // Error genérico
  response.status(500).json({ error: "Error interno del servidor" });
};

export default errorHandler;