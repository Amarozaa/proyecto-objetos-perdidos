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
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: "missing token" });
      return;
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET!);
    const csrfToken = req.headers["x-csrf-token"];

    if (
      typeof decodedToken === "object" &&
      decodedToken.id &&
      decodedToken.csrf === csrfToken
    ) {
      req.userId = decodedToken.id;
      next();
    } else {
      res.status(401).json({ error: "invalid token" });
    }
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
};
