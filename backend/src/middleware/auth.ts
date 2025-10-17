import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../utils/config";

// Middleware para verificar autenticación con JWT y CSRF
export const withUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener el token de las cookies
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: "missing token" });
      return;
    }

    // Verificar el JWT
    const decodedToken = jwt.verify(token, config.JWT_SECRET!);

    // Obtener el CSRF token del header
    const csrfToken = req.headers["x-csrf-token"];

    // Validar que el token es un objeto y tiene los campos necesarios
    if (
      typeof decodedToken === "object" &&
      decodedToken.id &&
      decodedToken.csrf === csrfToken
    ) {
      // Agregar el userId al request para usarlo en los controladores
      req.userId = decodedToken.id;
      next();
    } else {
      res.status(401).json({ error: "invalid token" });
    }
  } catch (error) {
    // Si hay error en la verificación del JWT
    res.status(401).json({ error: "invalid token" });
  }
};
